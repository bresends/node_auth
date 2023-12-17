import { Request, Response, Router } from 'express';
import { db } from '../../database/prismaClient.js';
import bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';

export const users = Router();

users.get('/', async (req: Request, res: Response) => {
    const users = await db.user.findMany();
    res.json(users);
});

users.post('/', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email)
        return res.status(400).json({ error: 'Name and email are required.' });

    if (!password)
        return res.status(400).json({ error: 'Password is required.' });

    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await db.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        res.json(user);
    } catch (error) {
        if (
            error instanceof PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            return res.status(400).json({ error: 'Email already in use.' });
        }
        res.status(500).json({ error: error.message });
    }

    res.json(user);
});
