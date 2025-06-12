import { expressjwt } from "express-jwt";
import { ConfigVariables } from "../config";
import { AuthCookie } from "../types";
import { Request } from "express";
import { AppDataSource } from "../config/data-source";
import { RefreshToken } from "../entity/RefreshToken";
import logger from "../config/logger";

interface RefreshTokenPayload {
    id: string;
    sub: string;
}

export default expressjwt({
    secret: ConfigVariables.REFRESH_SECRET_KEY!,
    algorithms: ["HS256"],
    getToken(req: Request) {
        console.log("1111111111111111111111111111111");
        const { refreshToken } = req.cookies as AuthCookie;
        console.log(
            "this is refreshToken ----- from validateRefreshToken --- ",
            refreshToken,
        );
        return refreshToken;
    },

    // when user want logout
    // when user want logout so this will revoke or delete the refreshToken form database
    // here we check is refreshToken exist in database or not ,
    // if not means user already revoked or logout

    async isRevoked(request: Request, token) {
        console.log("token", token);

        try {
            const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);

            const refreshToken = await refreshTokenRepo.find({
                where: {
                    // check refreshToken id is same in the database as the refreshToken id in the token
                    id: Number((token?.payload as RefreshTokenPayload).id),

                    // check user id is same as the user id in the token
                    user: { id: Number(token?.payload?.sub) },
                },
            });
            return refreshToken === null;
        } catch (error) {
            logger.error("Error while getting the refreshToken", {
                id: Number((token?.payload as RefreshTokenPayload).id),
            });
            console.log("error in isRevoked", error);
        }
        return true;
    },
});
