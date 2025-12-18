import { Router } from "express";
import { prisma } from "./services/prisma.js";

export const userRouter = Router();

userRouter.get("/", async (_req, res) => {
    const users = await prisma.user.findMany();
    res.json(users.map(({ nickname }) => nickname));
});
