import { CookieOptions } from "express";

const cookieConfig: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
};

export default cookieConfig;