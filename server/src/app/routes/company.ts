import { Router, Request, Response } from "express";
import { isAuthenticated } from "../middlewares/authenticated";
import { extractAuth, BindDto, useRepository, Resource } from "@/core/helpers";
import { CompanyDto } from "../data/company.dto";
import { Company } from "../models/Company";
import { User } from "../models/User";

export const company = Router();

company.get("/company/@me", [isAuthenticated], async (req: Request, res: Response) => {
    const auth = extractAuth(res);
    const companyRepository = useRepository(Company);

    const company = await companyRepository.findOneBy({ user: { id: auth?.userId } });

    if (!company) {
        return res.status(404).json({
            message: "Not Found.",
        });
    }

    return res.json(company);
});

company.post(
    "/company/@me",
    [isAuthenticated, BindDto(CompanyDto)],
    async (req: Request<any, any, CompanyDto>, res: Response) => {
        const auth = extractAuth(res);
        const userRepository = useRepository(User);

        const user = await userRepository.findOne({
            where: { id: auth?.userId },
            relations: {
                company: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "Not Found." });
        }

        if (user.company) {
            return res.status(409).json({ message: "Conflict." });
        }

        const companyRepository = useRepository(Company);

        await companyRepository.save({
            ...req.body,
            user: {
                id: auth?.userId,
            },
        });

        return res.status(201).json({});
    }
);
