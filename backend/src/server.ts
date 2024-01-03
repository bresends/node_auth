import express, { Express } from 'express';
import 'dotenv/config';
import { rootRouter } from './routes/root';
import { logger } from './lib/logger';
import { pinoHttp } from 'pino-http';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(
    pinoHttp({
        logger,
    })
);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api', rootRouter);

app.listen(port, () => {
    console.log(`[server]: Server is running on port: ${port}`);
});
