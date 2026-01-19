import { Request, Response, NextFunction } from "express";
import { Token } from "../models/Token";
import { AuthenticationService } from "../services/AuthenticationService";

export interface JwtPayload {
    tokenId: string;
    userId: string;
    type: "access_token" | "refresh_token";
}

declare global {
    namespace Express {
        interface Request {
            auth?: {
                payload: JwtPayload;
                token: Token;
            };
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token missing or invalid" });
    }

    const token = authHeader.substring(7);

    try {
        const decoded = await AuthenticationService.validateToken(token, "access_token");

        if (!decoded) {
            throw new Error("Failed to verify token.");
        }

        req.auth = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
