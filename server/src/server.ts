import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import { pinoHttp } from 'pino-http';
import { logger } from './lib/logger';
import { rootRouter } from './routes/api/root';
import { env } from '@/env';

const app: Express = express();

const allowedOriginsArray = env.ALLOWED_ORIGINS.split(',').map((item) =>
    item.trim()
);

app.use(
    pinoHttp({
        logger,
    })
);

// Allow javascript to access the cookie in the browser
app.use((req: Request, res: Response, next) => {
    const origin = req.headers.origin;

    if (allowedOriginsArray.includes(origin as string)) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    next();
});

app.use(
    cors({
        origin: (origin = '', callback) => {
            if (allowedOriginsArray.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        optionsSuccessStatus: 200,
    })
);

app.use(express.json());
app.use(cookieParser());
app.use('/api', rootRouter);

app.listen(env.PORT, () => {
    console.log(`[server]: Server is running on port: ${env.PORT}`);
});
