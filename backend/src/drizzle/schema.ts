import { relations, sql } from "drizzle-orm"
import { integer, pgTable, serial, text, timestamp, unique, varchar, boolean, index, pgEnum } from "drizzle-orm/pg-core"

export const UsersTable = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull().unique(),
    bio: text('bio'),
    profile_picture: text('profile_picture'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    search_vector: text('search_vector')
    
}, (table) => ({
    userNameSearchIndex: index('username_search_index').using('gin', sql`to_tsvector('english', ${table.username})`)
}))

export const friendshipStatusEnum = pgEnum('friendship_status', ['pending', 'accepted', 'declined'])

export const FriendshipsTable = pgTable('friendships', {
    id: serial('id').primaryKey(),
    friendship_status: friendshipStatusEnum().notNull(),
    sender_id: integer('sender_id').references(() => UsersTable.id).notNull(),
    receiver_id: integer('receiver_id').references(() => UsersTable.id).notNull(),
}, (table) => [{
    unique_table: unique().on(table.sender_id, table.receiver_id)
}])

export const PostsTable = pgTable('posts', {
    id: serial('id').primaryKey(),
    content: text('content'),
    mediaURL: text('mediaURL'),
    likes_count: integer('likes_count').default(0),
    comments_count: integer('comments_count').default(0),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
    author_id: integer('author_id').references(() => UsersTable.id).notNull(),
})

export const LikesTable = pgTable('likes', {
    id: serial('id').primaryKey(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    post_id: integer('post_id').references(() => PostsTable.id, { onDelete: 'cascade' }).notNull(),
    user_id: integer('user_id').references(() => UsersTable.id, { onDelete: 'cascade'}).notNull(),
})

export const CommentsTable = pgTable('comments', {
    id: serial('id').primaryKey(),
    content: text('content'),
    created_at: timestamp('created_at').defaultNow().notNull(),
    user_id: integer('user_id').references(() => UsersTable.id, { onDelete: 'cascade' }).notNull(),
    post_id: integer('post_id').references(() => PostsTable.id, { onDelete: 'cascade'}).notNull(),
})

export const notificationEnum = pgEnum('notification', ['like', 'comment', 'friend_request', 'friend_accept', 'friend_decline'])

export const NotificationsTable = pgTable('notifications', {
    id: serial('id').primaryKey(),
    notification_type: notificationEnum().notNull(),
    has_seen: boolean('has_seen').default(false).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    related_like_id: integer('related_like_id').references(() => LikesTable.id),
    related_friendship_id: integer('related_friendship_id').references(() => FriendshipsTable.id),
    related_comment_id: integer('related_comment_id').references(() => CommentsTable.id),
    receiver_id: integer('receiver_id').references(() => UsersTable.id, { onDelete: 'cascade' }).notNull(),
    sender_id: integer('sender_id').references(() => UsersTable.id, { onDelete: 'cascade' }).notNull()
}, (table) => [{
    unique_table: unique().on(table.receiver_id, table.sender_id, table.notification_type)
}])

export const ConversationsTable = pgTable('conversations', {
    id: serial('id').primaryKey(),
    user_one_id: integer('user_one_id').references(() => UsersTable.id).notNull(),
    user_two_id: integer('user_two_id').references(() => UsersTable.id).notNull(),
    create_at: timestamp('created_at').defaultNow().notNull()
}, (table) => [{
    unique_table: unique().on(table.user_one_id, table.user_two_id)
}])

export const MessagesTable = pgTable('messages', {
    id: serial('id').primaryKey(),
    message_content: text('message_content').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    conversation_id: integer('conversation_id').references(() => ConversationsTable.id).notNull(),
    message_sender_id: integer('message_sender_id').references(() => UsersTable.id).notNull(),
    message_receiver_id: integer('message_receiver_id').references(() => UsersTable.id).notNull(),
    is_read: boolean('is_read').default(false).notNull()
})


// Relations

export const UsersTableRelations = relations(UsersTable, ({ many }) => ({
    sender_friend_request: many(FriendshipsTable, {
        relationName: 'friendships_to_sender',
    }),
    receiver_friend_request: many(FriendshipsTable, {
        relationName: 'friendships_to_receiver',
    }),
    posts: many(PostsTable),
    likes: many(LikesTable),
    comment: many(CommentsTable),
    notification_sender: many(NotificationsTable, {
        relationName: 'notification_sender',
    }),
    notification_receiver: many(NotificationsTable, {
        relationName: 'notification_receiver',
    }),
    conversation_user_one: many(ConversationsTable, {
        relationName: 'conversation_user_one'
    }),
    conversation_user_two: many(ConversationsTable, {
        relationName: 'conversation_user_two'
    }),
    message_sender: many(MessagesTable, {
        relationName: 'message_sender'
    }),
    message_receiver: many(MessagesTable, {
        relationName: 'message_receiver'
    })
}))

export const FriendshipsTableRelations = relations(FriendshipsTable, ({ one }) => ({
    sender: one(UsersTable, {
        fields: [FriendshipsTable.sender_id],
        references: [UsersTable.id],
        relationName: 'friendships_to_sender'
    }),
    receiver: one(UsersTable, {
        fields: [FriendshipsTable.receiver_id],
        references: [UsersTable.id],
        relationName: 'friendships_to_receiver'
    }),
    notificationFriendshipId: one(NotificationsTable, {
        fields: [FriendshipsTable.id],
        references: [NotificationsTable.related_friendship_id]
    })
}))

export const PostsTableRelations = relations(PostsTable, ({ one, many }) => ({
    userPost: one(UsersTable, {
        fields: [PostsTable.author_id],
        references: [UsersTable.id]
    }),
    likes: many(LikesTable),
    comments: many(CommentsTable)
}))

export const LikesTableRelations = relations(LikesTable, ({ one }) => ({
    likedPost: one(PostsTable, {
        fields: [LikesTable.post_id],
        references: [PostsTable.id]
    }),
    userLike: one(UsersTable, {
        fields: [LikesTable.user_id],
        references: [UsersTable.id]
    }),
    notificationLikeId: one(NotificationsTable, {
        fields: [LikesTable.id],
        references: [NotificationsTable.related_like_id]
    })
}))

export const CommentsTableRelations = relations(CommentsTable, ({ one }) => ({
    commentedPost: one(PostsTable, {
        fields: [CommentsTable.post_id],
        references: [PostsTable.id]
    }),
    userComment: one(UsersTable, {
        fields: [CommentsTable.user_id],
        references: [UsersTable.id]
    }),
    notificationCommentId: one(NotificationsTable, {
        fields: [CommentsTable.id],
        references: [NotificationsTable.related_comment_id]
    })
}))

export const NotificationsTableRelations = relations(NotificationsTable, ({ one }) => ({
    sender: one(UsersTable, {
        fields: [NotificationsTable.sender_id],
        references: [UsersTable.id],
        relationName: 'notification_sender'
    }),
    receiver: one(UsersTable, {
        fields: [NotificationsTable.receiver_id],
        references: [UsersTable.id],
        relationName: 'notification_receiver'
    }),
    relatedLike: one(LikesTable, {
        fields: [NotificationsTable.related_like_id],
        references: [LikesTable.id]
    }),
    relatedFriendship: one(UsersTable, {
        fields: [NotificationsTable.related_friendship_id],
        references: [UsersTable.id],
    }),
    relatedComment: one(CommentsTable, {
        fields: [NotificationsTable.related_comment_id],
        references: [CommentsTable.id]
    })
}))

export const ConversationsTableRelations = relations(ConversationsTable, ({ one }) => ({
    userOne: one(UsersTable, {
        fields: [ConversationsTable.user_one_id],
        references: [UsersTable.id],
        relationName: 'conversation_user_one'
    }),
    userTwo: one(UsersTable, {
        fields: [ConversationsTable.user_two_id],
        references: [UsersTable.id],
        relationName: 'conversation_user_two'
    }),
    conversation: one(MessagesTable, {
        fields: [ConversationsTable.id],
        references: [MessagesTable.conversation_id]
    })
}))

export const MessagesTableRelations = relations(MessagesTable, ({ one }) => ({
    conversation: one(ConversationsTable, {
        fields: [MessagesTable.conversation_id],
        references: [ConversationsTable.id]
    }),
    sender: one(UsersTable, {
        fields: [MessagesTable.message_sender_id],
        references: [UsersTable.id],
        relationName: 'message_sender'
    }),
    receiver: one(UsersTable, {
        fields: [MessagesTable.message_receiver_id],
        references: [UsersTable.id],
        relationName: 'message_receiver'
    }),

}))