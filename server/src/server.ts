import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { rootRouter } from './routes/api/root.js';
import cookieParser from 'cookie-parser';
import { logEvents } from './middleware/logEvents.js';

const app: Express = express();
const port = process.env.PORT || 3000;

const allowedOrigins = ['http://localhost:5173'];

app.use(logEvents);

// Allow javascript to access the cookie in the browser
app.use((req: Request, res: Response, next) => {
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin as string)) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    next();
});

app.use(
    cors({
        origin: (origin = '', callback) => {
            if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
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

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
