import pino from 'pino';
import 'dotenv/config';

export const logger = pino({
    level: process.env.PINO_LOG_LEVEL || 'info',
});
