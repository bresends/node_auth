import { NextFunction, Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { db } from '@src/database/drizzleClient.js';
import { roles, users } from '@src/database/schema.js';
import { eq } from 'drizzle-orm';
import { env } from '@/env';

const { verify } = jsonwebtoken;

export const verifyRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        verify(
            token,
            env.ACCESS_TOKEN_SECRET as string,
            async (err, decoded) => {
                if (err) return res.sendStatus(401); // Unauthorized

                const { userId } = decoded as {
                    userId: number;
                };

                const user = await db
                    .select({ role: roles.name })
                    .from(users)
                    .where(eq(users.id, userId))
                    .innerJoin(roles, eq(users.roleId, roles.id));

                if (!user) {
                    return res.sendStatus(401);
                }

                const isAllowed = allowedRoles.some((role) =>
                    user[0].role.includes(role)
                );

                if (!isAllowed) {
                    return res.sendStatus(401);
                }

                next();
            }
        );
    };
};
