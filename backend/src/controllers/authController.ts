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
 * @route POST /auth/register
 * @description Creates a new user.
 * @returns HTTP 201, 400, 409, 500
 */
const register = expressAsyncHandler(async (req: Request, res: Response) => {
    const { username, password, confirmPassword, displayName, email } = req.body;

    if (!username || !password || !confirmPassword || !displayName || !email) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "All fields are required" })
        return;
    }

    // only supporting gmail for now, lol
    if (!email.endsWith("@gmail.com")) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Email not supported" });
        return;
    }

    // Check username, if it's already taken
    const usernameExists = !!await User.findOne({ username }).select('-password').lean().exec()

    if (usernameExists) {
        res.status(HttpStatusCodes.CONFLICT).send({ message: "A user already exists with the provided username" })
        return;
    }

    // Check email, if the user already has an account with this email
    const userEmailExists = !!await User.findOne({ email }).select('-password').lean().exec()

    if (userEmailExists) {
        res.status(HttpStatusCodes.CONFLICT).send({ message: "A user already exists with the provided email" })
        return;
    }

    if (password !== confirmPassword) {
        res.status(HttpStatusCodes.BAD_REQUEST).send({ message: "Passwords do not match" })
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        password: hashedPassword,
        displayName,
        email
    });

    if (user) {
        res.status(HttpStatusCodes.CREATED).send({ message: `User created successfully`, id: (user._id as ObjectId).toString() })
        return;
    } else {
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: "An error occured while creating a new user." })
    }
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

    res.status(HttpStatusCodes.OK).send({ message: "Logged in successfully", user: { displayName: user.displayName, id: (user._id as ObjectId).toString(), email: user.email } });
})

/**
 * @route POST /auth/logout
 * @description Logs out the user and clears the HTTP only cookie on the client.
 * @returns HTTP 200, 401
 */
const logout = expressAsyncHandler(async (req: Request, res: Response) => {
    res.clearCookie('jwt_rt', {
        ...cookieConfig,
        maxAge: undefined
    });

    res.clearCookie('jwt_at', {
        ...cookieConfig,
        maxAge: undefined
    });

    res.status(HttpStatusCodes.OK).send({ message: "User logged out successfully" });
})

export default {
    register,
    login,
    logout,
}