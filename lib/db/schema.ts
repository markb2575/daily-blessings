import { mysqlTable, varchar, text, int, timestamp, boolean, date, primaryKey, foreignKey } from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: text('name').notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    emailVerified: boolean('emailVerified').notNull(),
    role: varchar("role", { length: 12 }).default("none").notNull(),
    image: text('image'),
    createdAt: timestamp('createdAt').notNull(),
    updatedAt: timestamp('updatedAt').notNull()
});

export const curriculum = mysqlTable("curriculum", {
    curriculumId: int("curriculumId").primaryKey().autoincrement(),
    name: varchar("name", { length: 24 }),
});

export const day = mysqlTable("day", {
    date: date("date", { mode: 'date' }).primaryKey(),
    copticDate: varchar("copticDate", { length: 36 }).notNull(),
    feast: text(),
});

export const curriculum_day = mysqlTable("curriculum_day", {
    curriculumId: int("curriculumId").notNull().references(() => curriculum.curriculumId),
    date: date("date", { mode: 'date' }).notNull().references(() => day.date),
    book: varchar("book", { length: 24 }),
    chapter: int("chapter"),
    lowerVerse: int("lowerVerse"),
    upperVerse: int("upperVerse"),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.curriculumId, table.date] }),
    };
});

export const curriculum_questions = mysqlTable("curriculum_questions", {
    questionId: int("questionId").primaryKey().autoincrement(),
    isFillInTheBlank: boolean().notNull(),
    question: text().notNull(),
    curriculumId: int("curriculumId").notNull(),
    date: date("date", { mode: 'date' }).notNull()
}, (table) => {
    return {
        curriculum_day_reference: foreignKey({ columns: [table.curriculumId, table.date], foreignColumns: [curriculum_day.curriculumId, curriculum_day.date]}),
    };
});

export const classroom = mysqlTable("classroom", {
    classroomId: int("classroomId").primaryKey().autoincrement(),
    curriculumId: int("curriculumId").notNull().references(() => curriculum.curriculumId),
    studentCode: varchar('studentCode', { length: 7 }).notNull(),
    teacherCode: varchar('teacherCode', { length: 7 }).notNull()
});

export const classroom_member = mysqlTable("classroom_member", {
    classroomId: int("classroomId").notNull().references(() => classroom.classroomId),
    userId: varchar('userId', { length: 36 }).notNull().references(() => user.id),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.classroomId, table.userId] }),
    };
});

export const answers = mysqlTable("answers", {
    answerId: int("answerId").primaryKey().autoincrement(),
    questionId: int("questionId").notNull().references(() => curriculum_questions.questionId),
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
    curriculum,
    day,
    curriculum_day,
    curriculum_questions,
    classroom,
    classroom_member,
    answers,
    session,
    account,
    verification,
};