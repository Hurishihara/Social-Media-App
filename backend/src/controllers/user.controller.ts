import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import UserService from '../services/user.service'
import { userCookie } from '../utils/cookie';
import { upload } from '../../multer.config';

class UserController {
    async registerUser(req: Request, res: Response): Promise<void> {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ message: errors.array()});
            return;
        }

        const { username, email, password } = req.body;
        try {
            await UserService.registerUser(username, email, password);
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'An unknown error occurred' })
            }
        }
        }

        async loginUser(req: Request, res: Response): Promise<void> {
            const { email, password } = req.body;

            const error = validationResult(req);
            if (!error.isEmpty()) {
                res.status(400).json({ message: error.array() });
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
                if (error instanceof Error) {
                    res.status(400).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: 'An unknown error occurred' });
                }
            }
        }

        async logoutUser(req: Request, res: Response): Promise<void> {
            res.setHeader('Set-Cookie', await UserService.logoutUser());
            res.status(200).json({ message: 'User logged out successfully' });
        }

        async updateUser(req: Request, res: Response): Promise<void> {
            upload.single('profilePicture')(req, res, async (err) => {
                if (err) {
                    console.error('Upload error', err)
                    return res.status(500).json({ message: 'Error uploading image' });
                }
                try {
                    const { userId, username, bio } = req.body;
                    const profilePictureUrl = req.file ? req.file.path : '';
                    console.log('profilePictureUrl', profilePictureUrl)
                    console.log('userId', userId)
                    console.log('username', username)
                    console.log('bio', bio)
                    await UserService.updateUser(userId, username, profilePictureUrl, bio);
                    res.status(200).json({ message: 'User updated' });
                }
                catch (err) {
                    console.error('Error updating user', err)
                    res.status(500).json({ message: 'Error updating user' });
                }
             })
        }
    }

export default new UserController();