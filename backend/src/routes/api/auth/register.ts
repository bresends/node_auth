import { db } from '@/database/drizzleClient.js';
import { roles, users } from '@/database/schema.js';
import { LibsqlError } from '@libsql/client';
import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';

export const register = Router();

register.post('/', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ error: 'Email required.' });
    if (!password)
        return res.status(400).json({ error: 'Password is required.' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const role = await db
            .insert(roles)
            .values({
                name: 'user',
            })
            .onConflictDoUpdate({ target: roles.name, set: { name: 'user' } })
            .returning({ roleId: roles.id });

        await db
            .insert(users)
            .values({
                email,
                password: hashedPassword,
                roleId: role[0].roleId,
            })
            .returning({ newUserId: users.id });

        res.status(201).json({ message: 'New user created.' });
    } catch (error) {
        if (error instanceof LibsqlError && error.code === 'SQLITE_CONSTRAINT') {
            return res.sendStatus(409); // Conflict
        }

        if (error instanceof Error) {
            console.log(error);
            return res.sendStatus(500);
        }
    }
});
