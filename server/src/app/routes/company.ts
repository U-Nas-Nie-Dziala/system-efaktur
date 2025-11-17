import { Router, Request, Response } from "express";
import { isAuthenticated } from "../middlewares/authenticated";
import { extractAuth } from "@/core/helpers";
import prisma from "@/core/prisma";

export const company = Router();

company.get("/company/@me", [isAuthenticated], async (req: Request, res: Response) => {
    const auth = extractAuth(res);

    const company = await prisma.companies.findFirst({
        where: {
            userId: auth?.userId,
        },
    });

    if (!company) {
        return res.status(404).json({
            message: "Not Found.",
        });
    }

    return res.status(200).json(company);
});
