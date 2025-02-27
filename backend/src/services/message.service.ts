import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { MessagesTable, UsersTable } from "../drizzle/schema";
import { profile } from "console";

class MessageService {
    async createMessage(conversationId: number, senderId: number, receiverId: number, content: string): Promise<any> {
        try {
            const message = await db.insert(MessagesTable).values({
                message_content: content,
                conversation_id: conversationId,
                message_sender_id: senderId,
                message_receiver_id: receiverId
            }).returning({
                id: MessagesTable.id,
                message_content: MessagesTable.message_content,
                conversationId: MessagesTable.conversation_id,
                senderId: MessagesTable.message_sender_id,
                receiverId: MessagesTable.message_receiver_id,
                createdAt: MessagesTable.created_at,
                isRead: MessagesTable.is_read
            })
    
            const user = await db.query.UsersTable.findFirst({
                where: eq(UsersTable.id, message[0].senderId),
                columns: {
                    id: true,
                    username: true,
                    profile_picture: true
                }
            })
    
            if (!user) return null
    
            return {
                id: message[0].id,
                content: message[0].message_content,
                createdAt: message[0].createdAt,
                isRead: message[0].isRead,
                sender: {
                    id: user.id,
                    username: user.username,
                    profilePicture: user.profile_picture
                }
    
            }
        }
        catch {
            throw new Error('Database error')
        }
    }
    async getMessages(conversationId: number): Promise<any> {
        try {
            const messages = await db.query.MessagesTable.findMany({
                where: eq(MessagesTable.conversation_id, conversationId),
                columns: {
                    id: true,
                    message_content: true,
                    created_at: true,
                    is_read: true
                },
                with: {
                    sender: {
                        columns: {
                            id: true,
                            username: true,
                            profile_picture: true
                        }
                    }
                }
            })
            if (messages.length === 0) return []
            
            return messages.map(message => {
                return {
                    id: message.id,
                    content: message.message_content,
                    createdAt: message.created_at,
                    isRead: message.is_read,
                    sender: {
                        id: message.sender.id,
                        username: message.sender.username,
                        profilePicture: message.sender.profile_picture
                    }
                }
            })
        }
        catch {
            throw new Error('Database error')
        }
    }
}

export default new MessageService();