import { Router } from 'express';
import limiter from '@src/middleware/LoginLimiter';
import authController from '@src/controllers/authController';
import AuthValidator from '@src/middleware/AuthValidator';

const { register, login, logout } = authController;

const AuthRouter = Router();

AuthRouter.post('/register', limiter, register);
AuthRouter.post('/login', limiter, login);

AuthRouter.use('/', AuthValidator);
AuthRouter.post('/logout', logout);

export default AuthRouter;
