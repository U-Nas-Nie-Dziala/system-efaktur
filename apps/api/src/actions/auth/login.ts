import type { LoginAccountRequest, LoginAccountResponse } from "@repo/contract";
import { useRepository } from "../../core/database";
import { User } from "../../models/User";
import * as bcrypt from "bcrypt";
import { Config } from "../../core/config";
import jwt from "jsonwebtoken";
import { Token } from "../../models/Token";

export const loginAccount = async (ctx: LoginAccountRequest): Promise<LoginAccountResponse> => {
    const userRepository = useRepository(User);

    const account = await userRepository.findOneBy({ email: ctx.body.email });

    if (!account) {
        return {
            status: 404,
            body: {
                message: "Konto nie istnieje.",
            },
        };
    }

    const passc = await bcrypt.compare(ctx.body.password, account.password);

    if (!passc) {
        return {
            status: 400,
            body: {
                message: "Wprowadzone hasło jest niepoprawne.",
            },
        };
    }

    const tokenRepository = useRepository(Token);

    const accessTokenModel = await tokenRepository.save({
        invalidated: false,
        type: "access_token",
        user: account,
    });

    const refreshTokenModel = await tokenRepository.save({
        invalidated: false,
        type: "refresh_token",
        user: account,
    });

    const accessToken = jwt.sign(
        {
            tokenId: accessTokenModel.id,
            userId: account.id,
            type: "access_token",
        },
        Config.key<string>("APP_JWT_SECRET"),
        {
            expiresIn: "2h",
            algorithm: "HS256",
        }
    );

    const refreshToken = jwt.sign(
        {
            tokenId: refreshTokenModel.id,
            userId: account.id,
            type: "refresh_token",
        },
        Config.key<string>("APP_JWT_SECRET"),
        {
            expiresIn: "7d",
            algorithm: "HS256",
        }
    );

    return {
        status: 200,
        body: {
            accessToken,
            refreshToken,
        },
    };
};
