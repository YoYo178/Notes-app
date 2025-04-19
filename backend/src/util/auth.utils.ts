import Env from '@src/common/Env';
import { tokenConfig } from '@src/config/tokenConfig';
import { IUser } from '@src/models/User';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';

/**
 * @description Generates and returns a new access token for a user
 * @param user User's MongoDB object
 * @param req Request object from express
 * @param res Response object from express
 * @returns string
 */
export function refreshAccessToken(user: IUser & Document) {
    const accessToken = jwt.sign(
        {
            User: {
                id: user.id,
                username: user.username,
                displayName: user.displayName,
            }
        },
        Env.AccessTokenSecret,
        { expiresIn: tokenConfig.accessToken.expiry }
    );

    return accessToken;
}