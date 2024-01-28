import pino from 'pino';
import { env } from '@/env';

export const logger = pino({
    level: env.PINO_LOG_LEVEL || 'info',
});
