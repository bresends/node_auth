import { Router } from 'express';

import { verifyJWT } from '../../middleware/verifyJWT.js';
import { verifyRole } from '../../middleware/verifyRoles.js';
import { db } from '../../database/prismaClient.js';
export const admin = Router();

admin.use(verifyJWT);
admin.use(verifyRole(['admin']));

admin.get('/', async (req, res) => {
    const allUsers = await db.user.findMany({
        select: {
            id: true,
            email: true,
            roles: {
                select: {
                    name: true,
                },
            },
        },
    });
    return res.status(200).json({ users: allUsers });
});
