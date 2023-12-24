import { Router } from 'express';
import { auth } from './auth.js';
import { register } from './register.js';
import { user } from './user.js';
import { refresh } from './refresh.js';
import { logout } from './logout.js';
import { admin } from './admin.js';

export const rootRouter = Router();

rootRouter.use('/register', register);
rootRouter.use('/auth', auth);
rootRouter.use('/refresh_token', refresh);
rootRouter.use('/logout', logout);
rootRouter.use('/user', user);
rootRouter.use('/admin', admin);
