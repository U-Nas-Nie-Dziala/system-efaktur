import { Router, Request, Response } from "express";
import { isAuthenticated } from "./../middlewares/authenticated"

export const router = Router();

router.get('/auth', [isAuthenticated], async (req: Request, res: Response) => {
    return res.status(200).json({
        status: 'ok'
    })
})

router.get('/', async (req: Request, res: Response) => {
    return res.status(200).json({
        message: "It's works."
    })
});
