import { NextFunction, Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { db } from '../database/prismaClient.js';

const { verify } = jsonwebtoken;

export const verifyRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        verify(
            token,
            process.env.ACESS_TOKEN_SECRET as string,
            async (err, decoded) => {
                if (err) return res.sendStatus(401); // Unauthorized

                const { userId } = decoded as {
                    userId: number;
                };

                const user = await db.user.findUnique({
                    where: {
                        id: userId,
                    },
                    select: {
                        roles: true,
                    },
                });

                if (!user) {
                    return res.sendStatus(401);
                }

                const isAllowed = allowedRoles.some((role) =>
                    user.roles.name.includes(role)
                );

                if (!isAllowed) {
                    return res.sendStatus(401);
                }

                next();
            }
        );
    };
};
