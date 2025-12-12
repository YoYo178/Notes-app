import logger from 'jet-logger';

import Env from '@src/common/ENV';
import server from './server';
import mongoose from 'mongoose';

import { connectDB } from '@src/common/db';

/******************************************************************************
                                  Run
******************************************************************************/

connectDB();

const SERVER_START_MSG = ('Express server started on port: ' +
  Env.Port.toString());

mongoose.connection.once('open', () => {
  logger.info(`Connected to MongoDB (${Env.NodeEnv || 'NODE_ENV NOT DEFINED!'})`);
  server.listen(Env.Port, () => logger.info(SERVER_START_MSG));
});

mongoose.connection.on('error', (error) => {
  // Only log errors that occur after connecting
  // Errors that occur during connecting will be handled in connnectDB()
  if (mongoose.connection.readyState !== 1)
    return;

  logger.err('An error occured while connecting to MongoDB!');
  logger.err(error);
});