import { Router } from 'express';

import { db } from '@/database/drizzleClient.js';
import { verifyJWT } from '@/middleware/verifyJWT.js';
import { verifyRole } from '@/middleware/verifyRoles.js';
import { roles, users } from '@/database/schema.js';
import { eq } from 'drizzle-orm';
export const user = Router();

user.use(verifyJWT);
user.use(verifyRole(['user', 'admin', 'editor']));

user.get('/', async (req, res) => {
    const userData = await db
        .select({
            name: users.name,
            email: users.email,
            role: roles.name,
        })
        .from(users)
        .where(eq(users.id, req.userId))
        .innerJoin(roles, eq(users.roleId, roles.id));

    return res.status(200).json({ user: userData[0] });
});
