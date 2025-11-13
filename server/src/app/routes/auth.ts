import { Router, Request, Response } from "express";
import { BindDto } from "@/core/helpers";
import { LoginDto, ILoginDto, RegisterDto, IRegisterDto } from "../data/auth.dto";
import prisma from "@/core/prisma";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";

export const auth = Router();

auth.post("/auth/login", [BindDto(LoginDto)], async (req: Request<any, any, ILoginDto>, res: Response) => {
    return res.status(200).json({
        message: "It's works.",
    });
});

auth.post("/auth/register", [BindDto(RegisterDto)], async (req: Request<any, any, IRegisterDto>, res: Response) => {
    const account = await prisma.users.findFirst({
        where: {
            email: req.body.email,
        },
    });

    if (!account) {
        return res.status(401).json([
            {
                property: "email",
                children: [],
                constraints: {
                    isExistsEmail: "email exists and belong to another userś",
                },
            },
        ]);
    }

    const hashed = await hash(req.body.password, 12);
    req.body.password = hashed;

    const user = await prisma.users.create({
        data: req.body,
    });

    // TODO: email verification?

    return res.status(201).json({});
});
