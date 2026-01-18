import { AppRoute, initContract, ServerInferRequest, ServerInferResponses, AppRouter } from "@ts-rest/core";
import { Request, Response } from "express";
import { z } from "zod";

const c = initContract();

import registerSchema from "./schemas/registerAccount";
import loginSchema from "./schemas/loginAccount";
import tokensSchema from "./schemas/tokenAccount";
import changePasswordSchema from "./schemas/changePassword";
import changePersonalSchema from "./schemas/changePersonal";
import contractorsCreate from "./schemas/contractorsCreate";
import contractorsUpdate from "./schemas/contractorsUpdate";
import productsCreate from "./schemas/productsCreate";
import productsUpdate from "./schemas/productsUpdate";
import ksefToken from "./schemas/ksefToken";
import companyData from "./schemas/companyData";

export const contract = c.router({
    health: {
        method: "GET",
        path: "/health",
        responses: {
            200: z.object({ message: z.string() }),
        },
    },
    registerAccount: {
        method: "POST",
        path: "/auth/register",
        body: registerSchema,
        responses: {
            201: z.object({}),
            419: z.object({ message: z.string() }),
        },
    },
    loginAccount: {
        method: "POST",
        path: "/auth/login",
        body: loginSchema,
        responses: {
            200: z.object({
                access_token: z.string(),
                refresh_token: z.string(),
            }),
            400: z.object({
                message: z.string(),
            }),
            404: z.object({
                message: z.string(),
            }),
        },
    },
    refreshTokens: {
        method: "POST",
        path: "/auth/tokens",
        body: tokensSchema,
        responses: {
            200: z.object({
                access_token: z.string(),
                refresh_token: z.string(),
            }),
            400: z.object({
                message: z.string(),
            }),
        },
    },
    changePassword: {
        method: "POST",
        path: "/me/change-password",
        body: changePasswordSchema,
        headers: z.object({
            authorization: z.string(),
        }),
        responses: {
            200: z.object({
                message: z.string(),
            }),
            400: z.object({
                message: z.string(),
            }),
        },
        metadata: {
            auth: true,
        },
    },
    changePersonal: {
        method: "POST",
        path: "/me/change-personal",
        body: changePersonalSchema,
        responses: {
            200: z.object({
                message: z.string(),
            }),
        },
        headers: z.object({
            authorization: z.string(),
        }),
        metadata: {
            auth: true,
        },
    },
    meInfo: {
        method: "GET",
        path: "/me/info",
        responses: {
            200: z.object({
                firstname: z.string(),
                lastname: z.string(),
                hasCompany: z.boolean(),
            }),
        },
        headers: z.object({
            authorization: z.string(),
        }),
        metadata: {
            auth: true,
        },
    },
    contractorsList: {
        method: "GET",
        path: "/contractors",
        responses: {
            200: z.array(
                z.object({
                    id: z.string(),
                    own_name: z.string(),
                    name: z.string(),
                    nip: z.string(),
                    street: z.string(),
                    address: z.string(),
                    zipcode: z.string(),
                    city: z.string(),
                    country: z.string(),
                })
            ),
        },
        headers: z.object({
            authorization: z.string(),
        }),
        metadata: {
            auth: true,
        },
    },
    contractorsCreate: {
        method: "POST",
        path: "/contractors",
        body: contractorsCreate,
        responses: {
            200: z.object({}),
        },
        headers: z.object({
            authorization: z.string(),
        }),
        metadata: {
            auth: true,
        },
    },
    contractorsUpdate: {
        method: "PATCH",
        path: "/contractors/:id",
        pathParams: z.object({
            id: z.string().uuid(),
        }),
        body: contractorsUpdate,
        responses: {
            404: z.object({ message: z.string() }),
            200: z.object({}),
        },
        headers: z.object({
            authorization: z.string(),
        }),
        metadata: {
            auth: true,
        },
    },
    contractorsDelete: {
        method: "DELETE",
        path: "/contractors/:id",
        pathParams: z.object({
            id: z.string().uuid(),
        }),
        responses: {
            204: z.object({}),
            404: z.object({ message: z.string() }),
        },
        headers: z.object({
            authorization: z.string(),
        }),
        metadata: {
            auth: true,
        },
    },
    productsList: {
        method: "GET",
        path: "/products",
        responses: {
            200: z.array(
                z.object({
                    id: z.string(),
                    name: z.string(),
                    description: z.string().optional(),
                    type: z.enum(["PRODUCT", "SERVICE"]),
                    unit: z.string(),
                    price_netto: z.number(),
                    price_brutto: z.number(),
                    vat_rate: z.string(),
                    created_at: z.coerce.date(),
                    updated_at: z.coerce.date(),
                })
            ),
        },
        headers: z.object({
            authorization: z.string(),
        }),
        metadata: {
            auth: true,
        },
    },
    productsCreate: {
        method: "POST",
        path: "/products",
        body: productsCreate,
        responses: {
            200: z.object({}),
            400: z.object({ message: z.string() }),
        },
        headers: z.object({
            authorization: z.string(),
        }),
        metadata: {
            auth: true,
        },
    },
    productsUpdate: {
        method: "PATCH",
        path: "/products/:id",
        pathParams: z.object({
            id: z.string().uuid(),
        }),
        body: productsUpdate,
        responses: {
            404: z.object({
                message: z.string(),
            }),
            200: z.object({}),
        },
        headers: z.object({
            authorization: z.string(),
        }),
        metadata: {
            auth: true,
        },
    },
    productsDelete: {
        method: "DELETE",
        path: "/products/:id",
        pathParams: z.object({
            id: z.string().uuid(),
        }),
        responses: {
            204: z.object({}),
            404: z.object({ message: z.string() }),
        },
        headers: z.object({
            authorization: z.string(),
        }),
        metadata: {
            auth: true,
        },
    },
    setKsefToken: {
        method: "PUT",
        path: "/@me/ksef-token",
        responses: {
            200: z.object({}),
            404: z.object({
                message: z.string(),
            }),
            409: z.object({
                message: z.string(),
            }),
        },
        body: ksefToken,
        headers: z.object({
            authorization: z.string(),
        }),
        metadata: {
            auth: true,
        },
    },
    setCompanyData: {
        method: "PUT",
        path: "/@me/company",
        responses: {
            200: z.object({}),
        },
        body: companyData,
        headers: z.object({
            authorization: z.string(),
        }),
        metadata: {
            auth: true,
        },
    },
});

export type RouteCtx<T extends AppRoute | AppRouter> = {
    ctx: ServerInferRequest<T> & {
        req: Request;
        res: Response;
    };
    response: ServerInferResponses<T>;
};
