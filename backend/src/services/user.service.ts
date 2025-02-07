import { and, eq, is, sql } from "drizzle-orm";
import { db } from "../db/db";
import { FriendshipsTable, UsersTable } from "../drizzle/schema";
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
        const token = generateToken(user[0].id);
        return {user: user[0] as User, token: token};
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

    async searchUser(query: string, currentUser?: number): Promise<any[]> {
        if (!query) {
            return [];
        }
        const users = await db.select().from(UsersTable).where(sql`to_tsvector('english', ${UsersTable.username}) @@ to_tsquery('english', ${query})`);
        const checkFriends = await db.select({
            status: FriendshipsTable.friendship_status
        }).from(FriendshipsTable).where(and(
            eq(FriendshipsTable.receiver_id, users[0].id ?? 0),
            eq(FriendshipsTable.sender_id, currentUser ?? 0)
        ))
        return users.map(user => {
            const isFriendStatus = checkFriends.length > 0 ? checkFriends[0].status : null; 
            if (currentUser && user.id === currentUser) {
                return ({
                    id: user.id,
                    username: user.username,
                    profilePicture: user.profile_picture,
                    bio: user.bio,
                    isFriend: true
                })
            }
            return ({
                id: user.id,
                username: user.username,
                profilePicture: user.profile_picture,
                bio: user.bio,
                isFriend: isFriendStatus
            })
        })
    }
}

export default new UserService();