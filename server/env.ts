import { z } from 'zod';

const envSchema = z.object({
    PORT: z.string().default('3000'),
    DATABASE_URL: z.string().url(),
    DATABASE_AUTH_TOKEN: z.string().min(1),
    ALLOWED_ORIGINS: z.string(),
    ACCESS_TOKEN_SECRET: z.string().min(1),
    REFRESH_TOKEN_SECRET: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    MAIL_USER: z.string().min(1),
    MAIL_ADRESS: z.string().email(),
    CLIENT_URL: z.string().url(),
    PINO_LOG_LEVEL: z.string().default('info'),
});

export const env = envSchema.parse(process.env);
