import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import { db } from '../../database/prismaClient.js';

export const auth = Router();

auth.post('/', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: 'Email and password required.' });

    try {
        const user = await db.user.findUnique({ where: { email } });

        if (!user)
            return res.status(401).json({ error: 'Invalid credentials.' });

        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid)
            return res.status(401).json({ error: 'Invalid credentials.' });

        res.status(200).json({ message: 'Logged in.' });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
});
