import { JwtPayload, sign } from "jsonwebtoken";
import path from "path";
import fs from "fs";
import createHttpError from "http-errors";
import { ConfigVariables } from "../config";
import { User } from "../entity/User";
import { RefreshToken } from "../entity/RefreshToken";
import { Repository } from "typeorm";

export class TokenService {
    constructor(private refreshTokenRepository: Repository<RefreshToken>) {}

    generateAccessToken(payload: JwtPayload) {
        let privateKey: Buffer;

        try {
            // Sign the JWT with the private key
            // Read the private key from the file system
            // We can use path.join to make sure that it works on all OS

            privateKey = fs.readFileSync(
                path.join(__dirname, "../../certs/private.pem"),
            );
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            const error = createHttpError(
                500,
                "Error while reading private Key",
            );
            throw error;
        }

        const accessToken = sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "1m",
            issuer: "auth-service", // which service signs this token
        });
        return accessToken;
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(
            payload,
            ConfigVariables.REFRESH_SECRET_KEY!,
            {
                algorithm: "HS256",
                expiresIn: "1h",
                issuer: "auth-service",
                jwtid: String(payload.id), // unique identifier for the refresh token
            },
        );
        return refreshToken;
    }

    async persistRefreshToken(user: User) {
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; // One Leap Year
        const newRefreshToken = await this.refreshTokenRepository.save({
            user: user,
            expiresAt: new Date(Date.now() + MS_IN_YEAR),
        });
        return newRefreshToken;
    }

    async deleteRefreshToken(tokenId: number) {
        const deletedRefreshToken = await this.refreshTokenRepository.delete({
            id: tokenId,
        });
        return deletedRefreshToken;
    }
}
