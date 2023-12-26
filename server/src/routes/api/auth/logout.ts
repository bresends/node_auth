import { Request, Response, Router } from 'express';
import { db } from '../../../database/prismaClient.js';

export const logout = Router();

logout.get('/', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.jwt as string;

    if (!refreshToken) return res.sendStatus(204); // No content

    try {
        const user = await db.user.findFirst({
            where: { refreshToken: { some: { token: refreshToken } } },
        });

        if (!user) {
            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            });

            return res.sendStatus(204);
        }

        await db.refreshToken.delete({
            where: { token: refreshToken },
        });

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
