import { Router, Request, Response } from "express";
import { isAuthenticated } from "../middlewares/authenticated";
import { extractAuth, BindDto } from "@/core/helpers";
import prisma from "@/core/prisma";
import { CompanyDto, ICompanyType } from "../data/company.dto";

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

company.post("/company/@me", [isAuthenticated, BindDto(CompanyDto)], async (req: Request<any, any, ICompanyType>, res: Response) => {
    const auth = extractAuth(res);

    const account = await prisma.users.findFirst({
        where: {
            id: auth?.userId,
        },
        include: {
            company: true,
        },
    });

    if (account?.company) {
        return res.status(409).json({
            messagae: "Conflict",
        });
    }

    const company = await prisma.users.update({
        data: {
            company: {
                create: req.body,
            },
        },
        where: {
            id: auth?.userId,
        },
    });

    return res.status(201).json({
        id: company.id,
    });
});

company.patch("/company/:companyId", [isAuthenticated, BindDto(CompanyDto)], async (req: Request, res: Response) => {
    const auth = extractAuth(res);

    const account = await prisma.users.findFirst({
        where: {
            id: auth?.userId,
        },
        include: {
            company: true,
        },
    });

    if (!account?.company) {
        return res.status(404).json({
            message: "Not Found.",
        });
    }

    await prisma.users.update({
        where: {
            id: account.id,
        },
        data: {
            company: {
                update: req.body,
            },
        },
    });

    return res.status(200).json({});
});
