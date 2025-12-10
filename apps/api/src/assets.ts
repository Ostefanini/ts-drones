import express from "express";
import { type Asset, assetCreateSchema, assetUpdateSchema } from "@ts-drones/shared";

import { assets } from "./db.js";
import { validateAssetId, validateUniqueTags } from "./validators.js";

const assetsRouter = express.Router();

assetsRouter.get("/", (_req, res) => {
    res.json(assets);
});

assetsRouter.post("/", (req, res) => {
    const parsed = assetCreateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "validation", issues: parsed.error.issues });
    } else if (!validateUniqueTags(parsed.data)) {
        return res.status(400).json({ error: "validation", message: "Asset tags must be unique" });
    }

    const now = new Date().toISOString();
    const newAsset: Asset = {
        id: crypto.randomUUID(),
        createdAt: now,
        ...parsed.data,
    };
    assets.push(newAsset);

    res.status(201).json(newAsset);
});

assetsRouter.patch("/:id",
    validateAssetId,
    (req, res) => {
        const parsed = assetUpdateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: "validation", issues: parsed.error.issues });
        }

        if (!validateUniqueTags(parsed.data as Asset)) {
            return res.status(400).json({ error: "validation", message: "Asset tags must be unique" });
        }

        const updatedAsset = {
            ...assets[res.locals.assetIndex],
            ...req.body,
        };
        assets[res.locals.assetIndex] = updatedAsset;

        res.json(updatedAsset);
    });

assetsRouter.delete("/:id",
    validateAssetId,
    (_req, res) => {
        assets.splice(res.locals.assetIndex, 1);
        res.status(204).end();
    });

export { assetsRouter }