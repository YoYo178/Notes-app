import { Router } from 'express';
import AuthRouter from './Auth/AuthRouter';
import UsersRouter from './Users/UsersRouter';
import NotesRouter from './Notes/NotesRouter';
import FilesRouter from './Files/FilesRouter';

import AuthValidator from '@src/middleware/AuthValidator';

/******************************************************************************
                                Variables
******************************************************************************/

const apiRouter = Router();

apiRouter.use('/auth', AuthRouter);
apiRouter.use('/users', AuthValidator, UsersRouter);
apiRouter.use('/notes', AuthValidator, NotesRouter);
apiRouter.use('/files', AuthValidator, FilesRouter);

/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;
