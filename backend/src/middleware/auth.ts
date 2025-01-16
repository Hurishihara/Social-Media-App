import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { User } from "../models/user";
import { parse } from "cookie";


export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.authToken
    if (!token) {
        return res.status(403).json({ message: 'Access denied, token required' });
    }

    try {
        const user = verifyToken(token) as User;
        req.user = user;
        next();
    }
    catch(error) {
        return res.status(401).json({ message: 'Invalid or expired token' })
    }
}