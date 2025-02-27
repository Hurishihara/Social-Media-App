import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import UserService from '../services/user.service'
import { userCookie } from '../utils/cookie';
import { upload } from '../../multer.config';
import { Socket } from 'socket.io';
import CustomError from '../utils/error';
import { StatusCodes } from 'http-status-codes';

class UserController {
    async registerUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const errors = validationResult(req);
        const firstError = errors.array({ onlyFirstError: true })[0];
        if (!errors.isEmpty()) {
            if (firstError) {
                next(new CustomError(firstError.msg, 'Bad Request', StatusCodes.BAD_REQUEST));
                return;
            }
        }
        const { username, email, password } = req.body;
        try {
            await UserService.registerUser(username, email, password);
            res.status(201).json({ message: 'User registered successfully' });
        } 
        catch {
            next(new CustomError('Something went wrong', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR));
            return;
        }
    }

    async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { email, password } = req.body;
        const error = validationResult(req);
        const firstError = error.array({ onlyFirstError: true })[0];
        if (!error.isEmpty()) {
            if (firstError.msg === 'Database error') {
                next(new CustomError('Something went wrong', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR));
                return;
            }
            next(new CustomError(firstError.msg, 'Bad Request', StatusCodes.BAD_REQUEST));
            return;
        }
        
        try {
            const { user, token } = await UserService.loginUser(email, password);
            res.setHeader('Set-Cookie', userCookie(token))
            res.status(200).json({ message: `${user.username} logged in successfully`, 
                userId: user.id, 
                userName: user.username,
                bio: user.bio,
                profilePicture: user.profile_picture});
        }
        catch (error) {
            if (error === 'Database error') {
                next(new CustomError('Something went wrong', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR));
                return;
            }
            next(new CustomError('Incorrect password', 'Bad Request', StatusCodes.BAD_REQUEST));
            return;
        }
    }

    async logoutUser(req: Request, res: Response): Promise<void> {
        res.setHeader('Set-Cookie', await UserService.logoutUser());
        res.status(200).json({ message: 'User logged out successfully' });
    }

    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        upload.single('profilePicture')(req, res, async (err) => {
            if (err) {
                next(new CustomError('Error uploading image', 'Bad Request', StatusCodes.BAD_REQUEST))
            }
            try {
                const { userId, username, bio } = req.body;
                const profilePictureUrl = req.file ? req.file.path : '';
                await UserService.updateUser(userId, username, profilePictureUrl, bio);
                res.status(200).json({ message: 'User updated' });
            }
            catch (err) {
                next(new CustomError('Error updating user', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR))
            }
         })
    }
    async searchUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username } = req.params;
            const currentUser = req.user?.userId;
            if (!currentUser) {
                next(new CustomError('Please login to access this resource', 'Unauthorized', StatusCodes.UNAUTHORIZED));
                return;
            }
            const user = await UserService.searchUser(username, currentUser);
            res.status(200).json(user);
        }
        catch {
            next(new CustomError('Something went wrong', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR));
            return
        }
    }

    async SearchUserWebSocket(socket: Socket): Promise<void> {
        try {
            socket.on('search', async (query) => {
                const results = await UserService.searchUser(query);
                socket.emit('searchResults', results);
            })
        }
        catch (err) {
            console.error('Error searching for users', err);
        }
    }
}

export default new UserController();