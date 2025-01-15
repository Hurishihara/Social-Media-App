import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: "./src/drizzle/schema.ts",
    out: "./src/drizzle/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL as string
    },
    migrations: {
        table: 'my-migrations-table',
        schema: 'public',
    },
    verbose: true,
    strict: true,
})