import jwt from "jsonwebtoken";
import { useRepository } from "../core/database";
import { Config } from "../core/config";
import { Token } from "../models/Token";
import { In } from "typeorm";

export interface JwtPayload {
    tokenId: string;
    userId: string;
    type: "access_token" | "refresh_token";
}

export class AuthenticationService {
    public static isValidTokenPair(access: JwtPayload, refresh: JwtPayload): boolean {
        if (access.type === refresh.type) {
            return false;
        }

        return access.userId === refresh.userId;
    }

    public static async publishTokens(user: { id: string }) {
        const tokenRepository = useRepository(Token);

        const accessTokenModel = await tokenRepository.save({
            invalidated: false,
            type: "access_token",
            user: {
                id: user.id,
            },
        });

        const access_token = jwt.sign(
            { tokenId: accessTokenModel.id, type: "access_token", userId: user.id } as JwtPayload,
            Config.key<string>("APP_JWT_SECRET"),
            {
                algorithm: "HS256",
                expiresIn: "10m",
            }
        );

        const refreshTokenModel = await tokenRepository.save({
            invalidated: false,
            type: "refresh_token",
            user: {
                id: user.id,
            },
        });

        const refresh_token = jwt.sign(
            { tokenId: refreshTokenModel.id, type: "refresh_token", userId: user.id } as JwtPayload,
            Config.key<string>("APP_JWT_SECRET"),
            {
                expiresIn: "15min",
                algorithm: "HS256",
            }
        );

        return { access_token, refresh_token };
    }

    public static async validateToken(
        token: string,
        requiredTokenType: "access_token" | "refresh_token"
    ): Promise<{ payload: JwtPayload; token: Token } | false> {
        try {
            const payload = jwt.verify(token, Config.key<string>("APP_JWT_SECRET")) as JwtPayload;

            if (payload.type !== requiredTokenType) {
                throw new Error("Token has incorrect type.");
            }

            const tokenRepository = useRepository(Token);

            const tokenRecord = await tokenRepository.findOne({
                where: {
                    id: payload.tokenId,
                    user: {
                        id: payload.userId,
                    },
                    type: requiredTokenType,
                    invalidated: false,
                },
                relations: {
                    user: {
                        company: true,
                    },
                },
            });

            if (!tokenRecord) {
                throw new Error("Token not registered.");
            }

            return { payload, token: tokenRecord };
        } catch (e) {
            return false;
        }
    }

    public static async invalidateTokens(access: JwtPayload, refresh: JwtPayload): Promise<boolean> {
        try {
            if (!this.isValidTokenPair(access, refresh)) {
                throw new Error("Failed token verification pair.");
            }

            const tokenRepository = useRepository(Token);

            const res = await tokenRepository.update(
                {
                    id: In([access.tokenId, refresh.tokenId]),
                    user: {
                        id: access.userId,
                    },
                },
                { invalidated: true }
            );

            return res.affected === 2;
        } catch (e) {
            return false;
        }
    }

    public static async refreshTokens(
        accessPayload: JwtPayload,
        refreshPayload: JwtPayload
    ): Promise<false | { access_token: string; refresh_token: string }> {
        const isInvalidated = await this.invalidateTokens(accessPayload, refreshPayload);

        if (!isInvalidated) {
            return false;
        }

        return await this.publishTokens({ id: accessPayload.userId });
    }
}
