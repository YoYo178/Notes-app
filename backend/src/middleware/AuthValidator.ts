import jwt from 'jsonwebtoken';
import logger from 'jet-logger';
import { Request, Response, NextFunction } from 'express';
import expressAsyncHandler from 'express-async-handler';

import { NODE_ENVS } from '@src/common/constants';
import HTTP_STATUS_CODES from '@src/common/HTTP_STATUS_CODES';
import Env from '@src/common/Env';

import cookieConfig from '@src/config/cookieConfig';

import { User } from '@src/models/User';

import { refreshAccessToken } from '@src/util/auth.utils';

const tokenBlacklist: string[] = [];

/**
 * @description Authentication validator, verifies if the user is logged in or not
 * @returns HTTP 400, 401, 403, 409, 500
 */
const AuthValidator = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;

  const resetPasswordAccessToken: string | undefined = cookies?.jwt_reset_at;
  const refreshToken: string | undefined = cookies?.jwt_rt;
  const accessToken: string | undefined = cookies?.jwt_at;

  if (resetPasswordAccessToken) {
    const wantsToChangePassword = req.originalUrl.split('/').at(-1) === 'reset-password';

    const ResetPasswordAccessTokenSecret = Env.ResetPasswordAccessTokenSecret;

    if (!ResetPasswordAccessTokenSecret) {
      logger.err('RESET_PASSWORD_ACCESS_TOKEN_SECRET is undefined!');
      res.status(HTTP_STATUS_CODES.InternalServerError).send({ message: 'An error occured in the server.' });
      return;
    }

    try {
      // Decode user's password reset access token
      const decoded = jwt.verify(resetPasswordAccessToken, ResetPasswordAccessTokenSecret) as {
                userID: string,
                purpose: 'reset-password' | 'user-verification',
            };

      if (wantsToChangePassword && decoded.purpose === 'reset-password') {
        req.recoveringUser = { id: decoded.userID };
        next();
        return;
      }
    } catch (err) {
      // Need to check for jwt.TokenExpiredError first
      // because it inherits from jwt.JsonWebTokenError
      if (err instanceof jwt.TokenExpiredError) {
        res.status(HTTP_STATUS_CODES.Unauthorized).send({ message: err?.message === 'jwt expired' ? 'Expired token' : err?.message });
        return;
      } else if (err instanceof jwt.JsonWebTokenError) {
        res.status(HTTP_STATUS_CODES.BadRequest).send({ message: err?.message === 'invalid signature' ? 'Invalid token' : err?.message });
        return;
      }

      if (err instanceof Error)
        res.status(HTTP_STATUS_CODES.InternalServerError).json({ message: err.message });
      else
        res.send(HTTP_STATUS_CODES.InternalServerError);

      return;
    }
  }

  // Make sure the user is logged in
  if (!refreshToken) {
    res.status(HTTP_STATUS_CODES.Unauthorized).send({ message: 'User is not logged in' });
    return;
  }

  // Check if the access token is in token blacklist
  /** TODOs:
     * - Move this check into a global middleware
     *   so we can restrict access to our entire API.
     *   i.e - User cannot login either, until their token expires
     * 
     * - Use IP instead of token, makes it more secure
     */
  if (accessToken && tokenBlacklist.includes(accessToken)) {
    res.status(HTTP_STATUS_CODES.Forbidden).send({ message: 'Forbidden' });
    return;
  }

  const AccessTokenSecret = Env.AccessTokenSecret;

  if (!AccessTokenSecret) {
    logger.err('ACCESS_TOKEN_SECRET is undefined!');
    res.status(HTTP_STATUS_CODES.InternalServerError).send({ message: 'An error occured in the server.' });
    return;
  }

  const RefreshTokenSecret = Env.RefreshTokenSecret;

  if (!RefreshTokenSecret) {
    logger.err('REFRESH_TOKEN_SECRET is undefined!');
    res.status(HTTP_STATUS_CODES.InternalServerError).send({ message: 'An error occured in the server.' });
    return;
  }

  let userID: string | null = null;

  // Check for user's refresh token first, make sure it's valid
  try {
    // Decode user's refresh token
    const decoded = jwt.verify(refreshToken, RefreshTokenSecret) as {
            User: {
                id: string,
                username: string,
            },
            exp: number,
            iat: number,
        };
    userID = decoded.User.id;
  } catch (err) {
    // Need to check for jwt.TokenExpiredError first
    // because it inherits from jwt.JsonWebTokenError
    if (err instanceof jwt.TokenExpiredError) {
      res.status(HTTP_STATUS_CODES.Unauthorized).send({ message: err?.message === 'jwt expired' ? 'Expired token' : err?.message });
      return;
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(HTTP_STATUS_CODES.BadRequest).send({ message: err?.message === 'invalid signature' ? 'Invalid token' : err?.message });
      return;
    }

    if (err instanceof Error)
      res.status(HTTP_STATUS_CODES.InternalServerError).json({ message: err.message });
    else
      res.send(HTTP_STATUS_CODES.InternalServerError);

    return;
  }

  const user = userID ? await User.findById(userID).select('-password').lean().exec() : null;
  if (!user) {
    res.status(HTTP_STATUS_CODES.NotFound).send({ message: 'User not found' });
    return;
  }

  if (!accessToken) {
    // Generate new access token
    const accessToken = refreshAccessToken(user);

    res.cookie('jwt_at', accessToken, cookieConfig);

    // Add the user's id and username in the request for other handlers
    req.user = { id: user._id.toString(), username: user.username, displayName: user.displayName, email: user.email };

    // Move to other routes
    next();
    return;
  }

  // User's refresh token was valid, now check for their access token
  // If expired, then refresh it silently
  try {
    // Decode user's access token
    const decoded = jwt.verify(accessToken, AccessTokenSecret) as {
            User: {
                id: string,
                username: string,
                displayName: string,
            },
            exp: number,
            iat: number,
        };

    // Make sure the access token and refresh token belong to the same account
    // It's a malicious attempt otherwise
    if (decoded.User.id !== userID) {
      // Force logout immediately, Revoking access from the app's routes
      res.clearCookie('jwt-at', {
        httpOnly: true,
        sameSite: 'none',
        secure: Env.NodeEnv === NODE_ENVS.Production,
      });

      res.clearCookie('jwt-rt', {
        httpOnly: true,
        sameSite: 'none',
        secure: Env.NodeEnv === NODE_ENVS.Production,
      });

      // Add the access token to token blacklist
      tokenBlacklist.push(accessToken);

      // Remove the token from blacklist after it expires
      setTimeout(() => {
        tokenBlacklist.shift();
      }, (decoded.exp * 1000) - Date.now());

      res.status(HTTP_STATUS_CODES.Conflict).send({ message: 'Malicious attempt detected, You have been added to the blacklist' });
      return;
    }

    // Everything was valid, add the user's id and username in the request for other handlers
    req.user = { id: decoded.User.id, username: decoded.User.username, displayName: decoded.User.displayName, email: user.email };

    // Move to other routes
    next();
    return;
  } catch (err) {
    // Need to check for jwt.TokenExpiredError first
    // because it inherits from jwt.JsonWebTokenError
    if (err instanceof jwt.TokenExpiredError) {
      // Generate new access token
      const accessToken = refreshAccessToken(user);

      // Send the HTTP-only cookie to the client
      res.cookie('jwt_at', accessToken, cookieConfig);

      // Add the user's id and username in the request for other handlers
      req.user = { id: user._id.toString(), username: user.username, displayName: user.displayName, email: user.email };

      // Move to other routes
      next();
      return;
    } else if (err instanceof jwt.JsonWebTokenError) {
      res.status(HTTP_STATUS_CODES.BadRequest).send({ message: err?.message === 'invalid signature' ? 'Invalid token' : err?.message });
      return;
    }

    if (err instanceof Error)
      res.status(HTTP_STATUS_CODES.InternalServerError).json({ message: err.message });
    else
      res.send(HTTP_STATUS_CODES.InternalServerError);

    return;
  }
});

export default AuthValidator;