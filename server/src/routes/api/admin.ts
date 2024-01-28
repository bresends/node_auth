import { Router } from 'express';

import { db } from '@src/database/drizzleClient';
import { verifyJWT } from '@src/middleware/verifyJWT';
import { verifyRole } from '@src/middleware/verifyRoles';

import { roles, users } from '@src/database/schema.js';
import { eq } from 'drizzle-orm';

export const admin = Router();

admin.use(verifyJWT);
admin.use(verifyRole(['admin']));

admin.get('/', async (req, res) => {
    const allUsers = await db
        .select({
            name: users.name,
            email: users.email,
            role: roles.name,
        })
        .from(users)
        .innerJoin(roles, eq(users.roleId, roles.id));
    return res.status(200).json({ users: allUsers });
});
