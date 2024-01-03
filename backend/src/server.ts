import express, { Express } from 'express';
import 'dotenv/config';
import { rootRouter } from './routes/root';

const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api', rootRouter);


app.listen(port, () => {
    console.log(
        `[server]: Server is running at ${process.env.SERVER_URL}:${port}`
    );
});
