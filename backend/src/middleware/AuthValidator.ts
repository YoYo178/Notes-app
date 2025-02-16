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

const AuthValidator = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers.authorization || (req.headers.Authorization as string);

    if (!authHeader?.startsWith("Bearer ")) {
        res.status(HttpStatusCodes.UNAUTHORIZED).send({ message: "User is not logged in" })
        return;
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.REFRESH_TOKEN_SECRET) {
        logger.err("REFRESH_TOKEN_SECRET is undefined!");
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: "An error occured in the server." });
        return;
    }

    try {
        const decoded: any = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
        req.user = { username: decoded.username };
    } catch (err: any) {
        const error = err as JsonWebTokenError;
        res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send({ message: error.message });
        return;
    }
}

export default AuthValidator;