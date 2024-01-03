import { randomUUID } from 'crypto';
import { relations, sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    email: text('email').unique().notNull(),
    name: text('name'),
    password: text('password').notNull(),
    roleId: integer('roleId', { mode: 'number' }).references(() => roles.id),
    created_at: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
});

export const refreshToken = sqliteTable('refresh_tokens', {
    id: text('id', { length: 36 })
        .primaryKey()
        .$default(() => randomUUID()),
    token: text('token').unique().notNull(),
    userId: integer('userId', { mode: 'number' }).references(() => users.id),
    createdAt: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
});

export const passwordResetToken = sqliteTable('password_reset_tokens', {
    id: text('id', { length: 36 })
        .primaryKey()
        .$default(() => randomUUID()),
    userId: integer('userId', { mode: 'number' }).references(() => users.id),
    createdAt: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
});

export const roles = sqliteTable('roles', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name').unique().notNull(),
});

export const posts = sqliteTable('posts', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    content: text('content'),
    published: integer('published', { mode: 'boolean' }).default(false),
    authorId: integer('authorId', { mode: 'number' }).references(
        () => users.id
    ),
    createdAt: text('timestamp').default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ one, many }) => ({
    refreshTokens: many(refreshToken),
    passwordResetTokens: many(passwordResetToken),
    roles: one(roles, {
        fields: [users.id],
        references: [roles.id],
    }),
}));

export const refreshTokenRelations = relations(refreshToken, ({ one }) => ({
    user: one(users, {
        fields: [refreshToken.userId],
        references: [users.id],
    }),
}));

export const passwordResetTokenRelations = relations(
    passwordResetToken,
    ({ one }) => ({
        user: one(users, {
            fields: [passwordResetToken.userId],
            references: [users.id],
        }),
    })
);

export const rolesRelations = relations(roles, ({ many }) => ({
    users: many(users),
}));
