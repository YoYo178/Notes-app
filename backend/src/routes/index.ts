import { Router } from 'express';

import AuthRouter from './auth.routes.js';
import UsersRouter from './users.routes.js';
import NotesRouter from './notes.routes.js';
import FilesRouter from './files.routes.js';

import AuthValidator from '@src/middleware/authValidation.middleware.js';

/******************************************************************************
                                Variables
******************************************************************************/

const APIRouter = Router();

APIRouter.use('/auth', AuthRouter);
APIRouter.use('/users', AuthValidator, UsersRouter);
APIRouter.use('/notes', AuthValidator, NotesRouter);
APIRouter.use('/files', AuthValidator, FilesRouter);

/******************************************************************************
                                Export default
******************************************************************************/

export default APIRouter;
