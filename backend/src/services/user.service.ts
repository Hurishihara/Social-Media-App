import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { UsersTable } from "../drizzle/schema";
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/jwt";
import { User } from "../models/user";
import { userCookie } from "../utils/cookie";

class UserService {
    async registerUser(username: string, email: string, password: string): Promise<void> {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.insert(UsersTable).values({
            username: username,
            email: email,
            password: hashedPassword
        })
    }
    async loginUser(email: string, password: string) {
        const user = await db.select().from(UsersTable).where(eq(UsersTable.email, email));
        const hashedPassword = user[0].password;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatch) {
            throw new Error('Incorrect password');
        }
        return {user: user[0] as User, token: generateToken(user[0].id)}
    }

    async logoutUser () {
        return userCookie(null, true);
    }

    async updateUser(userId: number, username: string, profilePicture: string, bio: string): Promise<void> {
        if (username && profilePicture && bio) {
            await db.update(UsersTable).set({
                username: username,
                profile_picture: profilePicture,
                bio: bio
            }).where(eq(UsersTable.id, userId))
        }
        else if (username) {
            await db.update(UsersTable).set({
                username: username
            }).where(eq(UsersTable.id, userId))
        }
        else if (profilePicture) {
            await db.update(UsersTable).set({
                profile_picture: profilePicture
            }).where(eq(UsersTable.id, userId))
        }
        else if (bio) {
            await db.update(UsersTable).set({
                bio: bio
            }).where(eq(UsersTable.id, userId))
        }
    }
}

export default new UserService();