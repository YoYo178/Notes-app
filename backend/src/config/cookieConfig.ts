import { CookieOptions } from 'express';
import { tokenConfig } from './tokenConfig';
import Env from '@src/common/ENV';
import { NODE_ENVS } from '@src/common/constants';

const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: Env.NodeEnv === NODE_ENVS.Production,
  sameSite: Env.NodeEnv === NODE_ENVS.Production ? 'none' : 'lax',
  maxAge: tokenConfig.accessToken.expiry, // Re-used access token's expiry, 3 hours by default
};

export default cookieConfig;