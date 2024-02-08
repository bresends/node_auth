import { db } from '@src/database/drizzleClient.js';
import { refreshToken, users } from '@src/database/schema.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { Request, Response, Router } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { env } from '@/env';

const { sign } = jsonwebtoken;

export const login = Router();

login.post('/', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const oldRefreshToken = req.cookies.jwt as string;

    if (!email || !password)
        return res.status(400).json({ error: 'Email and password required.' });

    try {
        const user = await db
            .select({
                id: users.id,
                password: users.password,
                refreshTokenId: refreshToken.id,
            })
            .from(users)
            .where(eq(users.email, email))
            .leftJoin(refreshToken, eq(users.id, refreshToken.userId));

        if (!user.length) return res.sendStatus(401);

        const passwordMatch = await bcrypt.compare(password, user[0].password);

        if (!passwordMatch) return res.sendStatus(401);

        const accessToken = sign(
            { userId: user[0].id },
            env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: '30s' },
        );

        const newRefreshToken = sign(
            { userId: user[0].id },
            env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '1d' },
        );

        /*
        Scenario 
        1) User logs in but never uses RT and does not logout
        2) RT is stolen and used by attacker
        3) User logs in again
        In this I need to: clear all RTs when user logs in
        */
        if (oldRefreshToken) {
            const dbToken = await db
                .select({ oldToken: refreshToken.token })
                .from(refreshToken)
                .where(eq(refreshToken.token, oldRefreshToken));

            if (dbToken.length) {
                await db
                    .delete(refreshToken)
                    .where(eq(refreshToken.token, oldRefreshToken));
            } else {
                await db
                    .delete(refreshToken)
                    .where(eq(refreshToken.userId, user[0].id));
            }
        }

        // Store new refresh token in db
        await db.insert(refreshToken).values({
            token: newRefreshToken,
            userId: user[0].id,
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
