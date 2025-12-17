import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import BaseRouter from '@src/routes';

import Env from '@src/common/Env';
import HTTPS_STATUS_CODES, { HttpStatusCodes } from '@src/common/HTTP_STATUS_CODES';
import { RouteError } from '@src/common/route-errors';
import { NODE_ENVS } from '@src/common/constants';
import { CORS_CONFIG } from '@src/config/CORS';


/******************************************************************************
                                Variables
******************************************************************************/

const app = express();


// **** Setup


// Basic middleware
app.use(cors(CORS_CONFIG));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Show routes called in console during development
if (Env.NodeEnv === NODE_ENVS.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// Security
if (Env.NodeEnv === NODE_ENVS.Production.valueOf()) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use('/api', BaseRouter);

// Add error handler
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (Env.NodeEnv !== NODE_ENVS.Test.valueOf()) {
    logger.err(err, true);
  }
  let status: HttpStatusCodes = HTTPS_STATUS_CODES.BadRequest;
  if (err instanceof RouteError) {
    status = err.status;
    res.status(status).json({ error: err.message });
  }
  return next(err);
});

// Nav to users pg by default
app.get('/', (_: Request, res: Response) => {
  res.send('Hello, you are currently at \'/\'.');
  return;
});

/******************************************************************************
                                Export default
******************************************************************************/

export default app;
