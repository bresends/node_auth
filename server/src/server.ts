import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { rootRouter } from './routes/api/root.js';
import cookieParser from 'cookie-parser';
import { logEvents } from './middleware/logEvents.js';
import { logErrors } from './middleware/logErrors.js';

const app: Express = express();
const port = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS || '';
const allowedOriginsArray = allowedOrigins
    .split(',')
    .map((item) => item.trim());

app.use(logEvents);

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

app.use(logErrors);

app.listen(port, () => {
    console.log(
        `[server]: Server is running at ${process.env.SERVER_URL}:${port}`
    );
});
