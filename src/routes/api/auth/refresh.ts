import { Request, Response, Router } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { db } from '../../../database/prismaClient.js';

const { sign, verify } = jsonwebtoken;

export const refresh = Router();

refresh.get('/', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.jwt as string;

    if (!refreshToken) return res.sendStatus(401);

    // Remove previous refresh token
    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
    });

    try {
        const user = await db.user.findFirst({
            where: { refreshToken: { some: { token: refreshToken } } },
        });

        // Step 1: Check if user if the previous refresh token exists
        // Step 2: Check if the previous refresh token is valid (if it is not I can just block the attacker)
        // Step 3: If the previous refresh token is valid, but no user has it associated, delete all refresh tokens associated with the user ()
        if (!user) {
            verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET as string,
                async (err, decoded) => {
                    if (err) return res.sendStatus(403); // Forbidden
                    // Malicious user trying to use a refresh token that was already deleted
                    // Delete all refresh tokens associated with the attempted user
                    console.log('Boom!');
                    await db.refreshToken.deleteMany({
                        where: {
                            userId: (decoded as { userId: number }).userId,
                        },
                    });
                }
            );
            return res.sendStatus(403);
        }

        verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string,
            async (err, decoded) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        await db.refreshToken.delete({
                            where: { token: refreshToken },
                        });
                    }
                    return res.sendStatus(403);
                }

                const { userId } = decoded as {
                    userId: number;
                };

                if (userId !== user.id) return res.sendStatus(403);

                const newAccessToken = sign(
                    { userId: user.id },
                    process.env.ACESS_TOKEN_SECRET as string,
                    { expiresIn: '30s' }
                );

                const newRefreshToken = sign(
                    { userId: user.id },
                    process.env.REFRESH_TOKEN_SECRET as string,
                    { expiresIn: '10s' }
                );

                // Delete previous refresh token
                await db.refreshToken.delete({
                    where: { token: refreshToken },
                });

                // Store new refresh token in db
                await db.user.update({
                    where: { id: user.id },
                    data: {
                        refreshToken: { create: { token: newRefreshToken } },
                    },
                });

                res.cookie('jwt', newRefreshToken, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                    maxAge: 1000 * 60 * 60 * 24, // 1 day
                });

                res.json({ accessToken: newAccessToken });
            }
        );
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
            return res.sendStatus(500);
        }
    }
});
