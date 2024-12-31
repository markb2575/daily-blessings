## Setup Database for Development
- Setup a MySql Server and update the values in your .env accordingly (take a look at example .env)
- The database is (mostly) setup and the schema for it is at sql_queries/database.sql
- The current curriculum is stored in sql_queries/curriculum_5th Grade.sql
- Import the database.sql before importing any curriculum to your local database

## Useful commands
- npx drizzle-kit generate (if you change the schema.ts you can use this command to generate and SQL file from the changes)
- npx drizzle-kit studio (sets up a port to view the database in browser)
- npx shadcn@latest add [component] (use when you want to add a new shadcn component for frontend)





