import { and, eq, or } from "drizzle-orm";
import { db } from "../db/db";
import { ConversationsTable } from "../drizzle/schema";

class ConversationService {
    async createConversation(userOneId: number, userTwoId: number): Promise<any> {
        const conversation = await db.insert(ConversationsTable).values({
            user_one_id: userOneId,
            user_two_id: userTwoId
        }).returning({
            id: ConversationsTable.id,
            userTwoId: ConversationsTable.user_two_id
        })
        
        return conversation[0]
    }
    async getConversation(userId: number): Promise<any> {
        const conversations = await db.query.ConversationsTable.findMany({
            where: or(
                and(eq(ConversationsTable.user_one_id, userId)),
                and(eq(ConversationsTable.user_two_id, userId))
            ),
            columns: {
                id: true
            },
            with: {
                userOne: {
                    columns: {
                        id: true,
                        username: true,
                        profile_picture: true
                    }
                },
                userTwo: {
                    columns: {
                        id: true,
                        username: true,
                        profile_picture: true
                    }
                }
            }
        })

        if (conversations.length === 0) {
            return null
        }

        return conversations.map(conversation => {
            if (conversation.userOne.id === userId) {
                return {
                    id: conversation.id,
                    user: {
                        username: conversation.userTwo.username,
                        profilePicture: conversation.userTwo.profile_picture
                    }
                }
            }
            else {
                return {
                    id: conversation.id,
                    user: {
                        username: conversation.userOne.username,
                        profilePicture: conversation.userOne.profile_picture
                    }
                }
            }
        })
    }
}

export default new ConversationService();