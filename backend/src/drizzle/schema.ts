import { relations } from "drizzle-orm"
import { integer, pgTable, serial, text, timestamp, unique, varchar, boolean } from "drizzle-orm/pg-core"

export const UsersTable = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 255 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull().unique(),
    bio: text('bio'),
    profile_picture: text('profile_picture'),
    blocked_users: integer('blocked_users').array(),
    created_at: timestamp('created_at').defaultNow().notNull(),
})

export const FriendshipsTable = pgTable('friendships', {
    id: serial('id').primaryKey(),
    friendship_status: varchar('friendship_status', { length: 255 }),
    sender_id: integer('sender_id').references(() => UsersTable.id).notNull(),
    receiver_id: integer('user_id').references(() => UsersTable.id).notNull(),
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

export const NotificationsTable = pgTable('notifications', {
    id: serial('id').primaryKey(),
    notification_type: varchar('type', { length: 255 }).notNull(),
    has_seen: boolean('has_seen').default(false).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    receiver_id: integer('receiver_id').references(() => UsersTable.id, { onDelete: 'cascade' }).notNull(),
    sender_id: integer('sender_id').references(() => UsersTable.id, { onDelete: 'cascade' }).notNull()
})


// Relations

export const UsersTableRelations = relations(UsersTable, ({ many }) => ({
    sender_friend_request: many(FriendshipsTable),
    receiver_friend_request: many(FriendshipsTable),
    posts: many(PostsTable),
    likes: many(LikesTable),
    comment: many(CommentsTable),
    notifications: many(NotificationsTable)
}))

export const FriendshipsTableRelations = relations(FriendshipsTable, ({ one }) => ({
    sender: one(UsersTable, {
        fields: [FriendshipsTable.sender_id],
        references: [UsersTable.id]
    }),
    receiver: one(UsersTable, {
        fields: [FriendshipsTable.receiver_id],
        references: [UsersTable.id]
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
    })
}))

export const NotificationsTableRelations = relations(NotificationsTable, ({ one }) => ({
    sender: one(UsersTable, {
        fields: [NotificationsTable.sender_id],
        references: [UsersTable.id]
    })
}))