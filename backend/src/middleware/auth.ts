import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { User } from "../models/user";
import { parse } from "cookie";


export function authenticateToken(req: Request, res: Response, next: NextFunction): Response | void {
    const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
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