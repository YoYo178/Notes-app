import { Router } from 'express';
import limiter from '@src/middleware/LoginLimiter';
import authController from '@src/controllers/authController';
import AuthValidator from '@src/middleware/AuthValidator';

const { queryAuth, refresh, login, logout } = authController;

const AuthRouter = Router();

AuthRouter.post('/login', limiter, login);
AuthRouter.get('/refresh', limiter, refresh);
AuthRouter.post('/logout', logout);

AuthRouter.use('/', AuthValidator)
AuthRouter.get('/', limiter, queryAuth);

export default AuthRouter;
