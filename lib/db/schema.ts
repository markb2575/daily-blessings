import { mysqlTable, varchar, text, int, timestamp, boolean, date } from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: text('name').notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    emailVerified: boolean('emailVerified').notNull(),
    image: text('image'),
    createdAt: timestamp('createdAt').notNull(),
    updatedAt: timestamp('updatedAt').notNull()
});

export const questions = mysqlTable("questions", {
    questionId: int("questionsId").primaryKey().autoincrement(),
    isFillInTheBlank: boolean().notNull(),
    question: text().notNull(),
    date: date("date", { mode: 'date' }).notNull().references(() => day.date)
});

export const day = mysqlTable("day", {
    date: date("date", { mode: 'date' }).primaryKey(),
    copticDate: varchar("copticDate", { length: 36 }).notNull(),
    feast: text(),
    book: varchar("book", { length:24 }),
    chapter: int("chapter"),
    lowerVerse: int("lowerVerse"),
    upperVerse: int("upperVerse"),
});

export const answers = mysqlTable("answers", {
    answerId: int("answerId").primaryKey().autoincrement(),
    questionId: int("questionId").notNull().references(() => questions.questionId),
    answer: text().notNull(),
    userId: varchar('userId', { length: 36 }).notNull().references(() => user.id),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const session = mysqlTable("session", {
    id: varchar("id", { length: 36 }).primaryKey(),
    expiresAt: timestamp('expiresAt').notNull(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    createdAt: timestamp('createdAt').notNull(),
    updatedAt: timestamp('updatedAt').notNull(),
    ipAddress: text('ipAddress'),
    userAgent: text('userAgent'),
    userId: varchar('userId', { length: 36 }).notNull().references(() => user.id)
});

export const account = mysqlTable("account", {
    id: varchar("id", { length: 36 }).primaryKey(),
    accountId: text('accountId').notNull(),
    providerId: text('providerId').notNull(),
    userId: varchar('userId', { length: 36 }).notNull().references(() => user.id),
    accessToken: text('accessToken'),
    refreshToken: text('refreshToken'),
    idToken: text('idToken'),
    accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
    refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('createdAt').notNull(),
    updatedAt: timestamp('updatedAt').notNull()
});

export const verification = mysqlTable("verification", {
    id: varchar("id", { length: 36 }).primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expiresAt').notNull(),
    createdAt: timestamp('createdAt'),
    updatedAt: timestamp('updatedAt')
});

export const schema = {
    user,
    session,
    account,
    verification,
    questions,
    day,
    answers
};