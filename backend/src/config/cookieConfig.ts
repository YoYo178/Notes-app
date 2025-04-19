import { CookieOptions } from 'express';
import { tokenConfig } from './tokenConfig';
import Env from '@src/common/Env';
import { NodeEnvs } from '@src/common/constants';

const cookieConfig: CookieOptions = {
  httpOnly: true,
  secure: Env.NodeEnv === NodeEnvs.Production,
  sameSite: 'lax',
  maxAge: tokenConfig.accessToken.expiry, // Re-used access token's expiry, 3 hours by default
};

export default cookieConfig;