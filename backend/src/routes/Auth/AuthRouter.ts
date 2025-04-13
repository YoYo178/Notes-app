import { Router } from 'express';
import limiter from '@src/middleware/LoginLimiter';
import authController from '@src/controllers/authController';
import AuthValidator from '@src/middleware/AuthValidator';

const { register, verify, resendCode, login, recoverAccount, resetPassword, logout } = authController;

const AuthRouter = Router();

AuthRouter.use(limiter);

AuthRouter.post('/register', register);
AuthRouter.post('/verify', verify);
AuthRouter.post('/resend-code', resendCode);
AuthRouter.post('/login', login);
AuthRouter.post('/recover-account', recoverAccount);

AuthRouter.use(AuthValidator);

AuthRouter.post('/logout', logout);
AuthRouter.post('/reset-password', resetPassword);

export default AuthRouter;
