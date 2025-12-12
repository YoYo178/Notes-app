import Env from '@src/common/ENV';
import { tokenConfig } from '@src/config/tokenConfig';
import { IUser } from '@src/models/User';
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
    Env.AccessTokenSecret,
    { expiresIn: tokenConfig.accessToken.expiry / 1000 },
  );

  return accessToken;
}