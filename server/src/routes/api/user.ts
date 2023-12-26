import { Router } from 'express';

import { verifyJWT } from '../../middleware/verifyJWT.js';
import { verifyRole } from '../../middleware/verifyRoles.js';
export const user = Router();

user.use(verifyJWT);
user.use(verifyRole(['user', 'admin', 'editor']));

user.get('/', async (req, res) => {
    return res.status(200).json({ message: 'User route.' });
});
