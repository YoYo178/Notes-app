import ENV from '@src/common/env.js';
import { tokenConfig } from '@src/config/token.config.js';
import { type IUser } from '@src/models/user.model.js';
import jwt from 'jsonwebtoken';

/**
 * @description Generates and returns a new access token for a user
 * @param user User's MongoDB object
 * @param req Request object from express
 * @param res Response object from express
 * @returns string
 */
export function refreshAccessToken(user: IUser) {
  const accessToken = jwt.sign(
    {
      User: {
        id: user._id.toString(),
        username: user.username,
        displayName: user.displayName,
      },
    },
    ENV.ACCESS_TOKEN_SECRET,
    { expiresIn: tokenConfig.accessToken.expiry / 1000 },
  );

  return accessToken;
}