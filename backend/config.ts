/* eslint-disable n/no-process-env */

import path from 'path';
import dotenv from 'dotenv';
import moduleAlias from 'module-alias';
import fs from 'node:fs';

const genericEnvPath = path.join(__dirname, './config/.env');

// Import generic .env first
const result1 = dotenv.config({ path: genericEnvPath });
if (result1.error) {
  throw result1.error;
}

// Check the env
const NODE_ENV = (process.env.NODE_ENV ?? 'development');
const environmentEnvPath = path.join(__dirname, `./config/.env.${NODE_ENV}`);

// Import environment specific .env after importing generic .env
if (fs.existsSync(environmentEnvPath)) {
  const result2 = dotenv.config({
    path: environmentEnvPath,
    override: true,
  });
  if (result2.error) {
    throw result2.error;
  }
}

// Configure moduleAlias
if (__filename.endsWith('js')) {
  moduleAlias.addAlias('@src', __dirname + '/dist');
}
