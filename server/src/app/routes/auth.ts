import { Router, Request, Response } from "express";
import { BindDto, useRepository } from "@/core/helpers";
import { LoginDto, ILoginDto, RegisterDto, IRegisterDto } from "../data/auth.dto";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { Config } from "@/core/config";
import { User } from "../models/User";

export const auth = Router();

auth.post("/auth/login", [BindDto(LoginDto)], async (req: Request<any, any, ILoginDto>, res: Response) => {
    const userRepository = useRepository(User);

    const account = await userRepository.findOneBy({ email: req.body.email });

    if (!account) {
        return res.status(404).json({
            message: "Not Found.",
            errors: [
                {
                    property: "email",
                    children: [],
                    constraints: {
                        isNotExistsEmail: "email not exists",
                    },
                },
            ],
        });
    }

    const passc = await compare(req.body.password, account.password);

    if (!passc) {
        return res.status(401).json({
            message: "Unauthorized.",
            errors: [
                {
                    property: "password",
                    children: [],
                    constraints: {
                        isPasswordInvalid: "password invalid",
                    },
                },
            ],
        });
    }

    const [header, payload, signature] = jwt
        .sign(
            {
                userId: account.id,
                // more token data here
            },
            Config.key<string>("APP_JWT_SECRET"),
            {
                expiresIn: "2h",
                algorithm: "HS256",
            }
        )
        .split(".");

    res.cookie(Config.key<string>("AUTH_COOKIE"), signature, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 2,
    });

    return res.status(200).json({
        token: `${header}.${payload}`,
    });
});

auth.post("/auth/register", [BindDto(RegisterDto)], async (req: Request<any, any, IRegisterDto>, res: Response) => {
    const userRepository = useRepository(User);
    const account = await userRepository.findOneBy({ email: req.body.email });

    if (account) {
        return res.status(401).json({
            message: "Bad Request.",
            errors: [
                {
                    property: "email",
                    children: [],
                    constraints: {
                        isExistsEmail: "email not exists",
                    },
                },
            ],
        });
    }
    const hashed = await hash(req.body.password, 12);
    req.body.password = hashed;

    await userRepository.save(req.body);

    // TODO: email verification?
    return res.status(201).json({});
});
