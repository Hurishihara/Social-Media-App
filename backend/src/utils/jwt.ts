import 'dotenv/config';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default'
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h'

export function generateToken(userId: number): string {
    const payload = { userId };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

export function verifyToken(token: string): string | jwt.JwtPayload {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch(error) {
        throw new Error('Invalid or expired token');
    }
}