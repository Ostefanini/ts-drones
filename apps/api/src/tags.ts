import express from "express";
import { assets } from "./db";

const tagsRouter = express.Router();

tagsRouter.get("/", (_req, res) => {
    const allTags = assets.map(({ tags }) => tags).flat();
    const uniqueTags = Array.from(new Set(allTags));
    res.json(uniqueTags);
});

export { tagsRouter };