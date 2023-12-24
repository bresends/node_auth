import { Router } from 'express';

import { verifyJWT } from '../../middleware/verifyJWT.js';
import { verifyRole } from '../../middleware/verifyRoles.js';
export const admin = Router();

admin.use(verifyJWT);
admin.use(verifyRole(['admin']));

admin.get('/', async (req, res) => {
    return res.status(200).json({ message: 'Admin route.' });
});
