import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { db } from '../../database/prismaClient.js';

const { sign } = jsonwebtoken;

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

        // Generate JWT
        const accessToken = sign(
            { userId: user.id },
            process.env.ACESS_TOKEN_SECRET as string,
            { expiresIn: '30s' }
        );

        const refreshToken = sign(
            { userId: user.id },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '1d' }
        );

        // Store refresh token in db
        await db.user.update({
            where: { id: user.id },
            data: { refresh_token: refreshToken },
        });

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });

        res.status(200).json({ accessToken });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
});
