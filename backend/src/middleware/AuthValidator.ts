import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import logger from 'jet-logger'
import { Request, Response, NextFunction } from "express";
import HttpStatusCodes from '@src/common/HttpStatusCodes';
import { User } from '@src/models/User';
import expressAsyncHandler from 'express-async-handler';
import { ObjectId } from 'mongoose';
import cookieConfig from '@src/config/cookieConfig';
import { refreshAccessToken } from '@src/util/authUtils';

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
                username: string;
                displayName: string;
                email: string;
            }
        }
    }
}

const tokenBlacklist: string[] = [];

/**
 * @description Authentication validator, verifies if the user is logged in or not
 * @returns HTTP 400, 401, 403, 409, 500
 */
const AuthValidator = expressAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Make sure the user is logged in
    const cookies = req.cookies;
    if (!cookies?.jwt_rt) {
        res.status(HttpStatusCodes.UNAUTHORIZED).send({ message: "User is not logged in" })
        return;
    }

    const refreshToken = cookies.jwt_rt;
    const accessToken = cookies?.jwt_at || null;

    // Check if the access token is in token blacklist
    /** TODOs:
     * - Move this check into a global middleware
     *   so we can restrict access to our entire API.
     *   i.e - User cannot login either, until their token expires
     * 
     * - Use IP instead of token, makes it more secure
     */
    if (accessToken && tokenBlacklist.includes(accessToken)) {
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

    let userID: string | null = null;

    // Check for user's refresh token first, make sure it's valid
    try {
        // Decode user's refresh token
        const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        userID = decoded.User.id;
    } catch (err) {
        // Need to check for TokenExpiredError first
        // because it inherits from JsonWebTokenError
        if (err instanceof TokenExpiredError) {
            const error = err as TokenExpiredError;
            res.status(HttpStatusCodes.UNAUTHORIZED).send({ message: error?.message === "jwt expired" ? "Expired token" : error?.message });
            return;
        } else if (err instanceof JsonWebTokenError) {
            const error = err as JsonWebTokenError;
            res.status(HttpStatusCodes.BAD_REQUEST).send({ message: error?.message === "invalid signature" ? "Invalid token" : error?.message });
            return;
        }

        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: err?.message });
        return;
    }

    const user = userID ? await User.findById(userID).select('-password').lean().exec() : null;
    if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ message: "User not found" });
        return;
    }

    if (!accessToken) {
        // Generate new access token
        const accessToken = refreshAccessToken(user);

        res.cookie("jwt_at", accessToken, cookieConfig);

        // Add the user's id and username in the request for other handlers
        req.user = { id: (user._id as ObjectId).toString(), username: user.username, displayName: user.displayName, email: user.email };

        // Move to other routes
        next();
        return;
    }

    // User's refresh token was valid, now check for their access token
    // If expired, then refresh it silently
    try {
        // Decode user's access token
        const decoded: any = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        // Make sure the access token and refresh token belong to the same account
        // It's a malicious attempt otherwise
        if (decoded.User.id !== userID) {
            // Force logout immediately, Revoking access from the app's routes
            res.clearCookie('jwt-at', {
                httpOnly: true,
                sameSite: 'none',
                secure: process.env.NODE_ENV === "production"
            });

            res.clearCookie('jwt-rt', {
                httpOnly: true,
                sameSite: 'none',
                secure: process.env.NODE_ENV === "production"
            });

            // Add the access token to token blacklist
            tokenBlacklist.push(accessToken);

            // Remove the token from blacklist after it expires
            setTimeout(() => {
                tokenBlacklist.shift()
            }, (decoded.exp * 1000) - Date.now())

            res.status(HttpStatusCodes.CONFLICT).send({ message: "Malicious attempt detected, You have been added to the blacklist" });
            return;
        }

        // Everything was valid, add the user's id and username in the request for other handlers
        req.user = { id: decoded.User.id, username: decoded.User.username, displayName: decoded.User.displayName, email: user.email };

        // Move to other routes
        next();
        return;
    } catch (err: any) {
        // Need to check for TokenExpiredError first
        // because it inherits from JsonWebTokenError
        if (err instanceof TokenExpiredError) {
            // Generate new access token
            const accessToken = refreshAccessToken(user);

            // Send the HTTP-only cookie to the client
            res.cookie("jwt_at", accessToken, cookieConfig);

            // Add the user's id and username in the request for other handlers
            req.user = { id: (user._id as ObjectId).toString(), username: user.username, displayName: user.displayName, email: user.email };

            // Move to other routes
            next();
            return;
        } else if (err instanceof JsonWebTokenError) {
            const error = err as JsonWebTokenError;
            res.status(HttpStatusCodes.BAD_REQUEST).send({ message: error?.message === "invalid signature" ? "Invalid token" : error?.message });
            return;
        }

        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: err?.message });
        return;
    }
})

export default AuthValidator;