import { Request, Response, Router } from 'express';
import { db } from '@/database/drizzleClient.js';
import { refreshToken } from '@/database/schema.js';
import { eq } from 'drizzle-orm';

export const logout = Router();

logout.get('/', async (req: Request, res: Response) => {
    const oldRefreshToken = req.cookies.jwt as string;

    if (!oldRefreshToken) return res.sendStatus(204); // No content

    try {
        const dbToken = await db
            .select()
            .from(refreshToken)
            .where(eq(refreshToken.token, oldRefreshToken));

        if (!dbToken) {
            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            });

            return res.sendStatus(204);
        }

        await db
            .delete(refreshToken)
            .where(eq(refreshToken.token, oldRefreshToken));

        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });

        res.sendStatus(204);
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            return res.sendStatus(500);
        }
    }
});
