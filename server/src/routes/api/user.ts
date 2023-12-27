import { Router } from 'express';

import { db } from '../../database/prismaClient.js';
import { verifyJWT } from '../../middleware/verifyJWT.js';
import { verifyRole } from '../../middleware/verifyRoles.js';
export const user = Router();

user.use(verifyJWT);
user.use(verifyRole(['user', 'admin', 'editor']));

user.get('/', async (req, res) => {
    const userData = await db.user.findUnique({
        where: {
            id: req.userId,
        },
        select: {
            name: true,
            email: true,
            roles: {
                select: {
                    name: true,
                },
            },
        },
    });

    return res.status(200).json({ user: userData });
});
