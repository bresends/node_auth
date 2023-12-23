import { Request, Response, Router } from 'express';
import { db } from '../../database/prismaClient.js';

export const logout = Router();

logout.get('/', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.jwt as string;

    // No content
    if (!refreshToken) return res.sendStatus(204);

    try {
        const user = await db.user.findFirst({
            where: { refresh_token: refreshToken },
        });

        if (!user) {
            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            });

            return res.sendStatus(204);
        }

        await db.user.update({
            where: { id: user.id },
            data: { refresh_token: null },
        });

        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });

        res.sendStatus(204);
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
});
