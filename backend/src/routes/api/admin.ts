import { Router } from 'express';

import { db } from '@/database/drizzleClient';
import { verifyJWT } from '@/middleware/verifyJWT';
import { verifyRole } from '@/middleware/verifyRoles';

import { roles, users } from '@/database/schema.js';
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