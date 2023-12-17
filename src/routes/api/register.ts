import { Request, Response, Router } from 'express';
import { db } from '../../database/prismaClient.js';

export const users = Router();

users.get('/', async (req: Request, res: Response) => {
    const users = await db.user.findMany();
    res.json(users);
});

users.post('/', async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const user = await db.user.create({
        data: {
            name,
            email,
        },
    });
    res.json(user);
});
