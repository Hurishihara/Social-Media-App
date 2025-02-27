import { body } from "express-validator";
import { db } from "../db/db";
import { UsersTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { Request, Response, NextFunction } from "express";
import { parseCookies } from "../utils/cookie";
import { verifyToken } from "../utils/jwt";
import { JwtDecoded } from "../models/jwt";
import CustomError from "../utils/error";
import { StatusCodes } from "http-status-codes";



export const registerUserValidation = [
    body('username')
    .trim()
    .notEmpty().withMessage('Username cannot be empty')
    .matches(/^[a-zA-Z0-9_]*$/, 'g').withMessage('Username can only contain letters, numbers and underscores')
    .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters')
    .custom(async (value,) => {
        const checkExistingUserName = await db.select().from(UsersTable).where(eq(UsersTable.username, value))
        if (checkExistingUserName.length > 0) {
            throw new Error('Username already exists');
        }
    }),
    body('email')
    .trim()
    .normalizeEmail()
    .notEmpty().withMessage('Email cannot be empty')
    .isEmail().withMessage('Invalid email format')
    .custom(async (value) => {
        const checkExistingUserEmail = await db.select().from(UsersTable).where(eq(UsersTable.email, value))
        if (checkExistingUserEmail.length > 0) {
            throw new Error('Email already exists')
        }
    }),
    body('password')
    .trim()
    .notEmpty().withMessage('Password cannot be empty')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
]

export const loginUserValidation = [
    body('email')
    .trim()
    .normalizeEmail()
    .notEmpty().withMessage('Email cannot be empty').bail()
    .isEmail().withMessage('Invalid email format').bail()
    .custom(async value => {
        try {
            const checkExistingUserEmail = await db.select().from(UsersTable).where(eq(UsersTable.email, value))
            if (checkExistingUserEmail.length === 0) {
                throw new CustomError('Email does not exist', 'Not Found', StatusCodes.NOT_FOUND)
            }
        }
        catch (err: any) {
            //throw new Error(err)
            throw new CustomError('Database error', 'Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR)
        }
    }),
    body('password')
    .notEmpty().withMessage('Password cannot be empty')
]


export const userAuthValidation = (req: Request, res: Response, next: NextFunction): void => {
    const cookies = parseCookies(req);
    const token = cookies.authToken;

    if (!token) {
        next(new CustomError('Please login to access this resource', 'Unauthorized', StatusCodes.UNAUTHORIZED))
        return;
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded as JwtDecoded;
        next();
    }
    catch {
        next(new CustomError('Invalid token', 'Unauthorized', StatusCodes.UNAUTHORIZED))
        return;
    }
}