import { NextFunction, Request, Response } from 'express';
import { existsSync } from 'fs';
import { appendFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const logEvents = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    });
    const logItem = `${formatter.format(new Date())}\t${req.method}\t${
        req.headers.origin
    }\t${req.url}\n`;

    try {
        if (!existsSync(path.join(__dirname, '../logs'))) {
            await mkdir(path.join(__dirname, '../logs'));
        }
        await appendFile(
            path.join(__dirname, '../logs', 'events.log'),
            logItem
        );
    } catch (err) {
        console.error(err);
    }

    next();
};
