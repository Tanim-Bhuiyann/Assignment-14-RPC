import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("todos_table", {
    id: text().notNull().primaryKey(),
    title: text().notNull(),
    status: text().notNull(),
    createdAt: text().notNull(),
    updatedAt: text().notNull(),
});
