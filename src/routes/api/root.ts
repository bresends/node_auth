import { Request, Response, Router } from 'express';
import { users } from './register.js';

export const rootRouter = Router();

rootRouter.use('/register', users);
