import { Request } from "express";
import { expressjwt } from "express-jwt";
import { AuthCookie } from "../types";
import { ConfigVariables } from "../config";

export default expressjwt({
    secret: ConfigVariables.REFRESH_SECRET_KEY!,
    algorithms: ["HS256"],
    // First we need to get token from cookie , because refreshToken only stored at cookies
    getToken(req: Request) {
        const { refreshToken } = req.cookies as AuthCookie;
        return refreshToken;
    },
});
