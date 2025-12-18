import express, { Request, Response } from "express";


import { checkCombination, validateCombinationQuery } from "./validators.js";
import isProfane from '@idrisay/profanity-check';
import { userNicknameSchema } from "@ts-drones/shared";
import { prisma } from "./services/prisma.js";

const combinationsRouter = express.Router();

combinationsRouter.get("/is-found",
    validateCombinationQuery,
    checkCombination,
    async (_req: Request, res: Response) => {
        if (res.locals.combination) {
            res.json({ exist: true, foundBy: res.locals.combination.foundBy.nickname });
        } else {
            res.json({ exist: false, foundBy: null });
        }
    }
);

combinationsRouter.post("/attribute",
    validateCombinationQuery,
    checkCombination,
    async (req: Request, res: Response) => {
        try {
            if (res.locals.combination) {
                res.status(400).json({ error: "Combination already exists" });
                return;
            }

            const userNickname = userNicknameSchema.safeParse(req.body.userNickname);
            if (!userNickname.success) {
                res.status(400).json({ error: "Invalid nickname", issues: userNickname.error.issues });
                return;
            } else if (isProfane(userNickname.data)) {
                res.status(400).json({ error: "Nickname contains inappropriate language" });
                return;
            }

            await prisma.combination.create({
                data: {
                    assetOne: res.locals.assetOne,
                    assetTwo: res.locals.assetTwo ?? null,
                    assetThree: res.locals.assetThree ?? null,
                    assetFour: res.locals.assetFour ?? null,
                    foundBy: {
                        connectOrCreate: {
                            where: { nickname: userNickname.data },
                            create: { nickname: userNickname.data }
                        }
                    }
                }
            });
            res.sendStatus(201);
        } catch (error) {
            console.error(error);
            res.sendStatus(500)
        }
    }
)

export { combinationsRouter };