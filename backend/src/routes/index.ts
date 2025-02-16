import { Router } from 'express';
import AuthRouter from './Auth/AuthRouter';
import UsersRouter from './Users/UsersRouter';
import NotesRouter from './Notes/NotesRouter';

/******************************************************************************
                                Variables
******************************************************************************/

const apiRouter = Router();

apiRouter.use('/auth', AuthRouter);
apiRouter.use('/users', UsersRouter);
apiRouter.use('/notes', NotesRouter);

/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;
