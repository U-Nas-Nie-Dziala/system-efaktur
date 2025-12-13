import express from "express";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Database } from "./database";
import { EntityTarget, Repository, ObjectLiteral } from "typeorm";

export function BindDto<T extends object>(dto: ClassConstructor<T>) {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const instance = plainToInstance(dto, req.body);

            const errors = await validate(instance, {
                forbidNonWhitelisted: true,
                stopAtFirstError: true,
            });

            if (errors.length > 0) {
                return res.status(400).json({
                    message: "Bad Request",
                    errors: errors.map((v) => {
                        return {
                            property: v.property,
                            children: v.children,
                            constraints: v.constraints,
                        };
                    }),
                });
            }

            return next();
        } catch (e) {
            return res.status(400).json({
                message: "Bad Request.",
            });
        }
    };
}

type IExtractAuth = {
    userId: string;
    iat: Number;
    exp: Number;
};

export function extractAuth(res: express.Response): IExtractAuth | null {
    return res.locals.auth ?? null;
}

export function useRepository<T extends ObjectLiteral>(entity: EntityTarget<T>): Repository<T> {
    return Database.dataSource.getRepository(entity);
}

export function Resource<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const clone = { ...obj };

    for (const key of keys) {
        delete clone[key];
    }

    return clone;
}
