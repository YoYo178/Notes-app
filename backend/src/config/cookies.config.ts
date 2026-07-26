import type { CookieOptions } from 'express';
import { tokenConfig } from './token.config.js';
import ENV, { NODE_ENVS } from '@src/common/env.js';

const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: ENV.NODE_ENV === NODE_ENVS.PRODUCTION,
  sameSite: ENV.NODE_ENV === NODE_ENVS.PRODUCTION ? 'none' : 'lax',
  maxAge: tokenConfig.accessToken.expiry, // Re-used access token's expiry, 3 hours by default
};

export default cookieConfig;
