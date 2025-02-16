import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import logger from 'jet-logger'
import { Request, Response, NextFunction } from "express";
import HttpStatusCodes from '@src/common/HttpStatusCodes';

declare global {
    namespace Express {
        interface Request {
            user?: { username: string; }
        }
    }
}

const tokenBlacklist: string[] = [];

const AuthValidator = (req: Request, res: Response, next: NextFunction) => {
    // Make sure the user is logged in
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        res.status(HttpStatusCodes.UNAUTHORIZED).send({ message: "User is not logged in" })
        return;
    }

    // Make sure the user has a valid access token
    const authHeader: string | undefined = req.headers.authorization || (req.headers.Authorization as string);
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(HttpStatusCodes.UNAUTHORIZED).send({ message: "User is not logged in" })
        return;
    }

    const token = authHeader.split(" ")[1];

    // Check if the access token is in token blacklist
    if (tokenBlacklist.includes(token)) {
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
        const decodedRefreshToken: any = jwt.verify(cookies.jwt, process.env.REFRESH_TOKEN_SECRET);
        const decodedAccessToken: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

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
            tokenBlacklist.push(token);

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
        const error = err as JsonWebTokenError;
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message });
        return;
    }
}

export default AuthValidator;