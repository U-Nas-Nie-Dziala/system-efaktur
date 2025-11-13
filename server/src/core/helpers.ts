import express from "express";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export function BindDto<T extends object>(dto: ClassConstructor<T>) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const instance = plainToInstance(dto, req.body);

            const errors = await validate(instance, {
                forbidNonWhitelisted: true,
                stopAtFirstError: true,
            });

            if (errors.length > 0) {
                return res.status(400).json(
                    errors.map((v) => {
                        return {
                            property: v.property,
                            children: v.children,
                            constraints: v.constraints,
                        };
                    })
                );
            }

            return next();
        } catch (e) {
            return res.status(400).json({});
        }
    };
}
