import { User } from "@src/models/User";
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import logger from 'jet-logger'
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import cookieConfig from "@src/config/cookieConfig";
import { ObjectId } from "mongoose";
import { tokenConfig } from "@src/config/tokenConfig";

/**
 * @route GET /auth
 * @description A query route for the client to know if they're logged in or not
 * @returns HTTP 200
 */
const queryAuth = expressAsyncHandler(async (req: Request, res: Response) => {
    // No need to perform any checks
    // Auth validator middleware handles everything already
    res.status(HttpStatusCodes.OK).send({ message: "User is logged in" });
})

/**
 * @route POST /auth/login
 * @description Logs in the user and returns an HTTP only cookie to the client.
 * @returns HTTP 200, 400, 401, 404, 500
 */
const login = expressAsyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "All fields are required" });
        return;
    }

    const user = await User.findOne({ username }).lean().exec();

    if (!user) {
        res.status(HttpStatusCodes.NOT_FOUND).send({ message: "User not found" });
        return;
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
        res.status(HttpStatusCodes.UNAUTHORIZED).send({ message: "Invalid password" })
        return;
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
        logger.err("ACCESS_TOKEN_SECRET is undefined!");
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: "An error occured in the server." });
        return;
    }

    const accessToken = jwt.sign(
        {
            User: {
                id: (user._id as ObjectId).toString(),
                username: user.username,
                displayName: user.displayName
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: tokenConfig.accessToken.expiry }
    )

    if (!process.env.REFRESH_TOKEN_SECRET) {
        logger.err("REFRESH_TOKEN_SECRET is undefined!");
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: "An error occured in the server." });
        return;
    }

    const refreshToken = jwt.sign(
        {
            User: {
                id: (user._id as ObjectId).toString(),
                username: user.username
            }
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: tokenConfig.refreshToken.expiry }
    )

    res.cookie("jwt_rt", refreshToken, {
        ...cookieConfig,
        maxAge: tokenConfig.refreshToken.expiry, // 7 days
    });

    res.cookie("jwt_at", accessToken, cookieConfig);

    res.status(HttpStatusCodes.OK).send({ message: "Logged in successfully", user: { displayName: user.displayName, id: (user._id as ObjectId).toString() } });
})

/**
 * @route GET /auth/refresh
 * @description Provides the client with a new access token.
 * @returns HTTP 200, 400, 401, 404, 500
 */
const refresh = expressAsyncHandler(async (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies?.jwt_rt) {
        res.status(HttpStatusCodes.UNAUTHORIZED).send({ message: "Unauthorized" });
        return;
    }

    const refreshToken = cookies.jwt_rt;

    if (!process.env.REFRESH_TOKEN_SECRET) {
        logger.err("REFRESH_TOKEN_SECRET is undefined!");
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: "An error occured in the server." });
        return;
    }

    try {
        const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findOne({ username: decoded.User.username });

        if (!user) {
            res.status(HttpStatusCodes.NOT_FOUND).send({ message: "User not found" });
            return;
        }

        if (!process.env.ACCESS_TOKEN_SECRET) {
            logger.err("ACCESS_TOKEN_SECRET is undefined!");
            res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: "An error occured in the server." });
            return;
        }

        const accessToken = jwt.sign(
            {
                User: {
                    id: (user._id as ObjectId).toString(),
                    username: user.username,
                    displayName: user.displayName
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: tokenConfig.accessToken.expiry }
        )

        res.cookie("jwt_at", accessToken, cookieConfig);

        res.status(HttpStatusCodes.OK).send({ message: `Welcome ${decoded.User.username}` })
    } catch (err: any) {
        if (err instanceof JsonWebTokenError) {
            const error = err as JsonWebTokenError;
            res.status(HttpStatusCodes.BAD_REQUEST).send({ message: error?.message === "invalid signature" ? "Invalid token" : error?.message });
            return;
        }

        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: err?.message });
    }

})

/**
 * @route POST /auth/logout
 * @description Logs out the user and clears the HTTP only cookie on the client.
 * @returns HTTP 200, 401
 */
const logout = expressAsyncHandler(async (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies?.jwt_rt && !cookies?.jwt_at) {
        res.status(HttpStatusCodes.UNAUTHORIZED).send({ message: "User is not logged in" });
        return;
    }

    res.clearCookie('jwt_rt', {
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV === "production"
    });

    res.clearCookie('jwt_at', {
        httpOnly: true,
        sameSite: 'none',
        secure: process.env.NODE_ENV === "production"
    });

    res.status(HttpStatusCodes.OK).send({ message: "User logged out successfully" });
})

export default {
    queryAuth,
    login,
    refresh,
    logout
}