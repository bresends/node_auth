import { Request, Response, Router } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { db } from '@src/database/drizzleClient.js';
import { refreshToken, users } from '@src/database/schema.js';
import { eq } from 'drizzle-orm';
import { env } from '@/env';

const { sign, verify } = jsonwebtoken;

export const refresh = Router();

refresh.get('/', async (req: Request, res: Response) => {
    const oldRefreshToken = req.cookies.jwt as string;

    if (!oldRefreshToken) return res.sendStatus(401);

    try {
        const user = await db
            .select({
                id: users.id,
            })
            .from(refreshToken)
            .where(eq(refreshToken.token, oldRefreshToken))
            .leftJoin(users, eq(refreshToken.userId, users.id));

        // Step 1: Check if user previous refresh token exists
        // Step 2: Check if the previous refresh token is valid (if it is not I can just block the attacker)
        // Step 3: If the previous refresh token is valid, but no user has it associated, delete all refresh tokens associated with the user ()
        if (!user) {
            verify(
                oldRefreshToken,
                env.REFRESH_TOKEN_SECRET as string,
                async (err, decoded) => {
                    if (err) return res.sendStatus(403); // Forbidden
                    // Malicious user trying to use a refresh token that was already deleted
                    // Delete all refresh tokens associated with the attempted user
                    await db
                        .delete(refreshToken)
                        .where(
                            eq(
                                refreshToken.userId,
                                (decoded as { userId: number }).userId
                            )
                        );
                }
            );
            return res.sendStatus(403); // Forbidden
        }

        verify(
            oldRefreshToken,
            env.REFRESH_TOKEN_SECRET as string,
            async (err, decoded) => {
                if (err) {
                    if (err.name === 'TokenExpiredError') {
                        await db
                            .delete(refreshToken)
                            .where(eq(refreshToken.token, oldRefreshToken));
                    }
                    return res.sendStatus(403);
                }

                const { userId } = decoded as {
                    userId: number;
                };

                if (userId !== user[0]?.id) return res.sendStatus(403);

                const newAccessToken = sign(
                    { userId: user[0].id },
                    env.ACCESS_TOKEN_SECRET as string,
                    { expiresIn: '30s' }
                );

                const newRefreshToken = sign(
                    { userId: user[0].id },
                    env.REFRESH_TOKEN_SECRET as string,
                    { expiresIn: '1d' }
                );

                // Delete previous refresh token
                await db
                    .delete(refreshToken)
                    .where(eq(refreshToken.token, oldRefreshToken));

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
