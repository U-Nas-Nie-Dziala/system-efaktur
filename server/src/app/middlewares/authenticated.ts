import { Config } from "@/core/config";
import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'

export async function isAuthenticated (req: Request, res: Response, next: NextFunction) {
    try {
        const header = req.headers.authorization;

        if (!header) {
            return res.status(401).json({
                message: 'Missing auth header.'
            })
        }

        const secret = req.cookies[Config.key<string>('AUTH_COOKIE')];

        if (!secret) {
            return res.status(401).json({
                message: 'Missing auth cookie.'
            })
        }

        const token = `${header}.${secret}`;

        jwt.verify(token, Config.key('APP_JWT_SECRET'))

        return next();
    } catch (e) {
        return res.status(401).json({
            message: 'Unauthorized.'
        })
    }
}