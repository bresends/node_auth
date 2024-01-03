import { Router } from 'express';

export const user = Router();

user.get('/', async (req, res) => {
    return res.status(200).json({ user: 1 });
});
