import { Router } from 'express';

import { verifyJWT } from '../../middleware/verifyJWT.js';
export const user = Router();

user.get('/', verifyJWT, async (req, res) => {
    return res.status(200).json({ message: 'User route.' });
});
