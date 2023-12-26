import { Request, Response, Router } from 'express';
import { db } from '../../../database/prismaClient.js';
import bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library.js';

export const register = Router();

register.post('/', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ error: 'Email required.' });

    if (!password)
        return res.status(400).json({ error: 'Password is required.' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.user.create({
            data: {
                email,
                password: hashedPassword,
                roles: {
                    connect: {
                        name: 'user',
                    },
                },
            },
        });
        res.status(201).json({ message: 'User created.' });
    } catch (error) {
        if (
            error instanceof PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            return res.status(400).json({ error: 'Email already in use.' });
        }

        if (error instanceof Error) {
            console.log(error.message);
            return res.sendStatus(500);
        }
    }
});
