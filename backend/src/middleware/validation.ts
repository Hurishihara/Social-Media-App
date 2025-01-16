import { body } from "express-validator";
import { db } from "../db/db";
import { UsersTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import bcrypt from 'bcrypt';


export const registerUserValidation = [
    body('username')
    .trim()
    .notEmpty().withMessage('Username cannot be empty')
    .matches(/^[a-zA-Z0-9_]*$/, 'g').withMessage('Username can only contain letters, numbers and underscores')
    .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters')
    .custom(async value => {
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
    .custom(async value => {
        const checkExistingUserEmail = await db.select().from(UsersTable).where(eq(UsersTable.email, value))
        if (checkExistingUserEmail.length > 0) {
            throw new Error('Email already exists');
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
    .notEmpty().withMessage('Email cannot be empty')
    .isEmail().withMessage('Invalid email format')
    .custom(async value => {
        const checkExistingUserEmail = await db.select().from(UsersTable).where(eq(UsersTable.email, value))
        if (checkExistingUserEmail.length === 0) {
            throw new Error('Email does not exist');
        }
    }),
    body('password')
    .trim()
    .notEmpty().withMessage('Password cannot be empty')
    .custom(async (value, { req } ) => {
        const email = req.body.email;
        const getPassword = await db.select().from(UsersTable).where(eq(UsersTable.email, email))
        if (getPassword.length === 0) {
            throw new Error('Password does not exist')
        }
    })
]