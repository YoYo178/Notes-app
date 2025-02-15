import { Router } from 'express';
import limiter from '@src/middleware/LoginLimiter';
import authController from '@src/controllers/authController';

const { refresh, login, logout } = authController;

const AuthRouter = Router();

AuthRouter.post('/login', limiter, login);
AuthRouter.get('/refresh', refresh);
AuthRouter.post('/logout', logout);

export default AuthRouter;
