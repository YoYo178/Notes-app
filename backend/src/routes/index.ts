import { Router } from 'express';
import AuthRouter from './Auth/AuthRouter';

/******************************************************************************
                                Variables
******************************************************************************/

const apiRouter = Router();

apiRouter.use('/auth', AuthRouter)

/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;
