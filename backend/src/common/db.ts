import mongoose from 'mongoose';
import ENV from './env.js';
import logger from '@src/utils/logger.utils.js';

mongoose.connection.on('error', (error) => {
  // Only log errors that occur after connecting
  // Errors that occur during connecting will be handled in connnectDB()
  if (mongoose.connection.readyState !== 1) return;

  logger.error('An error occured while connecting to MongoDB!');
  logger.error(error);
});

export async function connectDB() {
  try {
    const mongoURI = ENV.MONGODB_URI;
    if (!mongoURI) {
      logger.error('MONGODB_URI is not defined in the .env file!');
      return;
    }

    await mongoose.connect(mongoURI);

    logger.info(`Connected to MongoDB (${ENV.NODE_ENV})`);
  } catch (error) {
    logger.error('An error occured while connecting to MongoDB! More details below:');
    logger.error(error);
  }
}
