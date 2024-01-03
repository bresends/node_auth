import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
    schema: './src/database/schema.ts',
    out: './drizzle',
    driver: 'turso',
    dbCredentials: {
        url: process.env.DATABASE_URL as string,
        authToken: process.env.DATABASE_AUTH_TOKEN as string,
    },
    verbose: true,
    strict: true,
});
