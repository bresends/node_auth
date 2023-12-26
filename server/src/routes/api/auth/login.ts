import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { db } from '../../../database/prismaClient.js';

const { sign } = jsonwebtoken;

export const login = Router();

login.post('/', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const oldRefreshToken = req.cookies.jwt as string;

    if (!email || !password)
        return res.status(400).json({ error: 'Email and password required.' });

    try {
        const user = await db.user.findUnique({ where: { email } });

        if (!user)
            return res.status(401).json({ error: 'Invalid credentials.' });

        const passwordValid = await bcrypt.compare(password, user.password);

        if (!passwordValid)
            return res.status(401).json({ error: 'Invalid credentials.' });

        const accessToken = sign(
            { userId: user.id },
            process.env.ACESS_TOKEN_SECRET as string,
            { expiresIn: '30s' }
        );

        const newRefreshToken = sign(
            { userId: user.id },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '1d' }
        );

        // Remove previous refresh token
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });

        /*
        Scenario 
        1) User logs in but never uses RT and does not logout
        2) RT is stolen and used by attacker
        3) User logs in again
        In this I need to: clear all RTs when user logs in
        */
        if (oldRefreshToken) {
            const dbToken = await db.refreshToken.findUnique({
                where: { token: oldRefreshToken },
            });

            if (dbToken) {
                await db.refreshToken.delete({
                    where: { token: oldRefreshToken },
                });
            } else {
                await db.refreshToken.deleteMany({
                    where: { userId: user.id },
                });
            }
        }

        // Store new refresh token in db
        await db.user.update({
            where: { id: user.id },
            data: { refreshToken: { create: { token: newRefreshToken } } },
        });

        res.cookie('jwt', newRefreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });

        res.status(200).json({ accessToken });
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            return res.sendStatus(500);
        }
    }
});
