import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { schema } from "./schema";

// Singleton function to ensure only one db instance is created
function singleton<T>(name: string, value: () => T): T {
    const g = globalThis as { __singletons?: Record<string, unknown> };
    if (!g.__singletons) g.__singletons = {};
    if (!(name in g.__singletons)) {
      g.__singletons[name] = value();
    }
    return g.__singletons[name] as T;
}

// Function to create the database connection
function createDatabaseConnection() {
    if (!process.env.DATABASE_URL) {
        throw new Error('Missing DATABASE_URL');
    }

    const poolConnection = mysql.createPool(process.env.DATABASE_URL);
    return drizzle(poolConnection, { schema, mode: "default" });
}

// Export the singleton database instance
const db = singleton('db', createDatabaseConnection);
export { db };