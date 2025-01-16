import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import UserService from '../services/user.service'

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
    }

export default new UserController();