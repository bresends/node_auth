import { defineConfig } from 'drizzle-kit';
import { env } from './env';

export default defineConfig({
    schema: './src/database/schema.ts',
    out: './drizzle',
    driver: 'turso',
    dbCredentials: {
        url: env.DATABASE_URL as string,
        authToken: env.DATABASE_AUTH_TOKEN as string,
    },
    verbose: true,
    strict: true,
});
