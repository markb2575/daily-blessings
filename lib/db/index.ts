import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { schema } from "./schema";

// Singleton function to ensure only one db instance is created
function singleton<Value>(name: string, value: () => Value): Value {
    const globalAny: any = global;
    globalAny.__singletons = globalAny.__singletons || {};

    if (!globalAny.__singletons[name]) {
        globalAny.__singletons[name] = value();
    }

    return globalAny.__singletons[name];
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