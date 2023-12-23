import { Request, Response, Router } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { db } from '../../database/prismaClient.js';

const { sign, verify } = jsonwebtoken;

export const refresh = Router();

refresh.get('/', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.jwt as string;

    if (!refreshToken)
        return res.status(401).json({ error: 'No token provided!' });

    try {
        const user = await db.user.findFirst({
            where: { refresh_token: refreshToken },
        });

        if (!user) return res.status(403).json({ error: 'Forbidden' });

        verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string,
            (err, decoded) => {
                if (err) return res.status(403).json({ error: 'Forbidden' });

                const { userId } = decoded as {
                    userId: number;
                };

                if (userId !== user.id)
                    return res.status(403).json({ error: 'Forbidden' });

                const accessToken = sign(
                    { userId: user.id },
                    process.env.ACESS_TOKEN_SECRET as string,
                    { expiresIn: '30s' }
                );

                res.json({ accessToken });
            }
        );
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
    }
});
