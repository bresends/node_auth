import { Router } from 'express';
import { auth } from './auth.js';
import { register } from './register.js';
import { user } from './user.js';

export const rootRouter = Router();

rootRouter.use('/register', register);
rootRouter.use('/login', auth);
rootRouter.use('/user', user);
