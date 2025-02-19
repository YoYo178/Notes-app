import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import logger from 'jet-logger'
import { Request, Response, NextFunction } from "express";
import HttpStatusCodes from '@src/common/HttpStatusCodes';

declare global {
    namespace Express {
        interface Request {
            user?: { id: string; username: string; }
        }
    }
}

const tokenBlacklist: string[] = [];

/**
 * @description Authentication validator, verifies if the user is logged in or not
 * @returns HTTP 400, 401, 403, 409, 500
 */
const AuthValidator = (req: Request, res: Response, next: NextFunction) => {
    // Make sure the user is logged in
    const cookies = req.cookies;
    if (!cookies?.jwt_rt || !cookies.jwt_at) {
        res.status(HttpStatusCodes.UNAUTHORIZED).send({ message: "User is not logged in" })
        return;
    }

    const refreshToken = cookies.jwt_rt;
    const accessToken = cookies.jwt_at;

    // Check if the access token is in token blacklist
    /** TODOs:
     * - Move this check into a global middleware
     *   so we can restrict access to our entire API.
     *   i.e - User cannot login either, until their token expires
     * 
     * - Use IP instead of token, makes it more secure
     */
    if (tokenBlacklist.includes(accessToken)) {
        res.status(HttpStatusCodes.FORBIDDEN).send({ message: "Forbidden" });
        return;
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
        logger.err("ACCESS_TOKEN_SECRET is undefined!");
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: "An error occured in the server." });
        return;
    }

    if (!process.env.REFRESH_TOKEN_SECRET) {
        logger.err("REFRESH_TOKEN_SECRET is undefined!");
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: "An error occured in the server." });
        return;
    }

    try {
        // Decode both access token and refresh token
        const decodedRefreshToken: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const decodedAccessToken: any = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        // Make sure the access token and refresh token belong to the same account
        // It's a malicious attempt otherwise
        if (decodedAccessToken.User.username !== decodedRefreshToken.username) {
            // Force logout immediately, Revoking access from the app's routes
            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'none',
                secure: process.env.NODE_ENV === "production"
            });

            // Add the access token to token blacklist
            tokenBlacklist.push(accessToken);

            // Remove the token from blacklist after it expires
            setTimeout(() => {
                tokenBlacklist.shift()
            }, (decodedAccessToken.exp * 1000) - Date.now())

            res.status(HttpStatusCodes.CONFLICT).send({ message: "Malicious attempt detected, You have been added to the blacklist" });
            return;
        }

        // Everything was valid, add the username in the request for other handlers
        req.user = { username: decodedAccessToken.User.username };
        next();
    } catch (err: any) {
        if (err instanceof JsonWebTokenError) {
            const error = err as JsonWebTokenError;
            res.status(HttpStatusCodes.BAD_REQUEST).send({ message: err.message === "invalid signature" ? "Invalid token" : err.message });
            return;
        }

        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: err?.message });
    }
}

export default AuthValidator;