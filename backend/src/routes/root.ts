import { Router } from 'express';
import { user } from './user';

export const rootRouter = Router();

rootRouter.use('/user', user);
