import morgan from 'morgan';
import helmet from 'helmet';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'jet-logger';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import BaseRouter from '@src/routes';

import Env from '@src/common/Env';
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { RouteError } from '@src/common/route-errors';
import { NodeEnvs } from '@src/common/constants';
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
if (Env.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan('dev'));
}

// Security
if (Env.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Add APIs, must be after middleware
app.use('/api', BaseRouter);

// Add error handler
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (Env.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
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
