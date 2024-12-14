import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
// You can specify any property from the mysql2 connection options
export const db = drizzle({ connection: { uri: process.env.DATABASE_URL }});