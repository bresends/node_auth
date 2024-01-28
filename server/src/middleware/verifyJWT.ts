import { NextFunction, Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { env } from '@/env';

const { verify } = jsonwebtoken;

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer '))
        return res.status(401).json({ error: 'Unauthorized' });

    // Bearer token remove
    const token = authHeader.split(' ')[1];

    verify(token, env.ACCESS_TOKEN_SECRET as string, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });

        const { userId } = decoded as {
            userId: number;
        };

        req.userId = userId;

        next();
    });
};
