import { Router } from 'express';
import AuthRouter from './Auth/AuthRouter';
import UsersRouter from './Users/UsersRouter';
import NotesRouter from './Notes/NotesRouter';
import FilesRouter from './Files/FilesRouter';

/******************************************************************************
                                Variables
******************************************************************************/

const apiRouter = Router();

apiRouter.use('/auth', AuthRouter);
apiRouter.use('/users', UsersRouter);
apiRouter.use('/notes', NotesRouter);
apiRouter.use('/files', FilesRouter)

/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;
