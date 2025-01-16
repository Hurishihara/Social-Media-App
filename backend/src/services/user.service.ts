import { db } from "../db/db";
import { UsersTable } from "../drizzle/schema";
import bcrypt from 'bcrypt';

class UserService {
    async registerUser(username: string, email: string, password: string): Promise<void> {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.insert(UsersTable).values({
            username: username,
            email: email,
            password: hashedPassword
        })
    }
}

export default new UserService();