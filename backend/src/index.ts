import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import helmet from 'helmet';
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import APIRouter from '@src/routes/index.js';

import ENV, { NODE_ENVS } from '@src/common/env.js';
import HTTPS_STATUS_CODES from '@src/common/HttpStatusCodes.js';

import { CORSConfig } from '@src/config/cors.config.js';
import { ASSETS_PATH } from '@src/config/multer.config.js';

import AuthValidator from '@src/middleware/authValidation.middleware.js';
import { connectDB } from './common/db.js';
import logger from './utils/logger.utils.js';

await connectDB();

const app = express();

// Basic middleware
app.use(cors(CORSConfig));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// Show routes called in console during development
if (ENV.NODE_ENV === NODE_ENVS.DEVELOPMENT) {
  app.use(morgan('dev'));
}

// Security
if (ENV.NODE_ENV === NODE_ENVS.PRODUCTION) {
  app.use(helmet());
}

app.use('/assets/:fileType/:userId/:filename', AuthValidator, (req: Request, res: Response) => {
  const { fileType, userId, filename } = req.params;

  // make sure none of the fields are an array for some reason (typescript pls)
  // or if the person pases an invalid file type
  if (
    [fileType, userId, filename].some((param) => Array.isArray(param)) ||
    !['audio', 'images'].includes(fileType as string)
  ) {
    res.status(HTTPS_STATUS_CODES.BadRequest).json({ success: false, message: 'Bad Request' });
    return;
  }

  // check if the user is authorized to access the file
  // give a vague not found message otherwise
  // also if the file does not exist at all
  if (req.user.id !== userId) {
    res.status(HTTPS_STATUS_CODES.NotFound).json({ success: false, message: 'Not found' });
    return;
  }

  const filePath = path.join(ASSETS_PATH, fileType as string, userId, filename as string);

  // if the file does not exist
  if (!fs.existsSync(filePath)) {
    res.status(HTTPS_STATUS_CODES.NotFound).json({ success: false, message: 'Not Found' });
    return;
  }

  // allow resource to be used cross-origin
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  res.sendFile(filePath);
});

// Add APIs, must be after middleware
app.use('/api', APIRouter);

// Add error handler
app.use((err: Error, _: Request, _res: Response, next: NextFunction) => {
  if (ENV.NODE_ENV !== NODE_ENVS.TEST) {
    logger.error(err.message, true);
  }
  return next(err);
});

app.listen(ENV.PORT, () => {
  logger.info(`Express server started on port: ${ENV.PORT}`);
});