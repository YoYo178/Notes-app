import mongoose from 'mongoose';
import logger from 'jet-logger';
import Env from './ENV';

export async function connectDB() {
  try {
    const mongoURI = Env.MongodbUri;
    if (!mongoURI) {
      logger.err('MONGODB_URI is not defined in the .env file!');
      return;
    }

    await mongoose.connect(mongoURI);
  } catch (error) {
    logger.err('An error occured while connecting to MongoDB! More details below:');
    logger.err(error);
  }
}