/* eslint-disable n/no-process-env */

import path from 'path';
import dotenv from 'dotenv';
import moduleAlias from 'module-alias';
// import Env from '@src/common/Env'

// Import generic .env first
const result1 = dotenv.config({
  path: path.join(__dirname, `./config/.env`),
});
if (result1.error) {
  throw result1.error
}

// Check the env
/*
const NODE_ENV = (Env.NodeEnv ?? 'development');

// Import environment specific .env after importing generic .env
const result2 = dotenv.config({
  path: path.join(__dirname, `./config/.env.${NODE_ENV}`),
  override: true
});
if (result2.error) {
  throw result2.error;
}
*/

// Configure moduleAlias
if (__filename.endsWith('js')) {
  moduleAlias.addAlias('@src', __dirname + '/dist');
}
