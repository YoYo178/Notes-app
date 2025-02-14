import { Router } from 'express';
import AuthRouter from './Auth/AuthRouter';
import UsersRouter from './Users/UsersRouter';

/******************************************************************************
                                Variables
******************************************************************************/

const apiRouter = Router();

apiRouter.use('/auth', AuthRouter)
apiRouter.use('/users', UsersRouter)

/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;
