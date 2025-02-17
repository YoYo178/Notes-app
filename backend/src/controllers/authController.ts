import { User } from "@src/models/User";
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import logger from 'jet-logger'
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import cookieConfig from "@src/config/cookieConfig";

/**
@route POST /auth/login
@description Logs in the user and returns an HTTP only cookie to the client.
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
                username: user.username,
                displayName: user.displayName
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "3h" }
    )

    if (!process.env.REFRESH_TOKEN_SECRET) {
        logger.err("REFRESH_TOKEN_SECRET is undefined!");
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: "An error occured in the server." });
        return;
    }

    const refreshToken = jwt.sign(
        { username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
    )

    res.cookie("jwt_rt", refreshToken, cookieConfig) // Default maxAge is 7d

    res.cookie("jwt_at", accessToken, {
        ...cookieConfig,
        maxAge: 3 * 60 * 60 * 1000 // 3h
    })

    res.status(HttpStatusCodes.OK).send({ message: "Logged in successfully" })
})

/**
@route GET /auth/refresh
@description Provides the client with a new access token.
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

        const user = await User.findOne({ username: decoded.username });

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
                    username: user.username,
                    displayName: user.displayName
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "3h" }
        )

        res.cookie("jwt_at", accessToken, {
            ...cookieConfig,
            maxAge: 3 * 60 * 60 * 1000 // 3h
        })

        res.status(HttpStatusCodes.OK).send({ message: `Welcome ${decoded.username}` })
    } catch (err: any) {
        const error = err as JsonWebTokenError;
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message });
        return;
    }

})

/**
@route POST /auth/logout
@description Logs out the user and clears the HTTP only cookie on the client.
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
    login,
    refresh,
    logout
}