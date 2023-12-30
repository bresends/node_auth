import { Router } from 'express';
import { login } from './auth/login.js';
import { register } from './auth/register.js';
import { user } from './user.js';
import { refresh } from './auth/refresh.js';
import { logout } from './auth/logout.js';
import { admin } from './admin.js';
import { resetPassword } from './auth/reset_password.js';

export const rootRouter = Router();

rootRouter.use('/register', register);
rootRouter.use('/auth', login);
rootRouter.use('/refresh_token', refresh);
rootRouter.use('/reset_password', resetPassword);
rootRouter.use('/logout', logout);
rootRouter.use('/user', user);
rootRouter.use('/admin', admin);
