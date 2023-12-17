import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import { rootRouter } from './routes/api/root.js';

const app: Express = express();
const port = process.env.PORT || 3000;

const corsWhitelist = ['http://localhost:3000'];

app.use(
    cors({
        origin: (origin = '', callback) => {
            if (corsWhitelist.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        optionsSuccessStatus: 200,
    })
);

app.use(express.json());
app.use('/api', rootRouter);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
