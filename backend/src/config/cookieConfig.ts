import { CookieOptions } from "express";
import { tokenConfig } from "./tokenConfig";

const cookieConfig: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: tokenConfig.accessToken.expiry // Re-used access token's expiry, 3 hours by default
};

export default cookieConfig;