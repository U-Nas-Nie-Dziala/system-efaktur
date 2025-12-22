import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Config } from "./config";
import { User } from "../models/User";
import { useRepository } from "./database";
import { Token } from "../models/Token";
import { In } from "typeorm";

interface JwtPayload {
    tokenId: string;
    userId: string;
    type: "access_token" | "refresh_token";
}

declare global {
    namespace Express {
        interface Request {
            auth: {
                payload: JwtPayload;
                token: Token;
            };
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token missing or invalid" });
    }

    const token = authHeader.substring(7);

    try {
        const decoded = await AuthenticationService.validateToken(token, "access_token");

        if (!decoded) {
            throw new Error("Failed to verify token.");
        }

        req.auth = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

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
                expiresIn: "1h",
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
                expiresIn: "7d",
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
                    user: true,
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
