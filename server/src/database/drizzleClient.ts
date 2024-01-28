import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { env } from '@/env';

const client = createClient({
    url: env.DATABASE_URL as string,
    authToken: env.DATABASE_AUTH_TOKEN as string,
});

export const db = drizzle(client, { schema });
