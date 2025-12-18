import express from "express";
import * as z from "zod/v4";
import {
    type Asset,
    assetCreateTextFieldsSchema,
    assetUpdateSchema, AssetListDTO
} from "@ts-drones/shared";

import { thumbnails } from "./services/db.js";
import {
    checkProductionAssets, checkThumbnail,
    validateAssetId, validateUniqueTags
} from "./validators.js";
import { upload } from "./services/multer.js";
import { prisma } from "./services/prisma.js";
import { formatAssetType, toAssetDTO } from "./helpers/formatters.js";

const assetsRouter = express.Router();

assetsRouter.get("/",
    async (_req, res) => {
        const assets = await prisma.asset.findMany();

        const formattedAssets: AssetListDTO = assets.map((asset) => toAssetDTO(
            asset,
            asset.createdAt,
            asset.type,
        ));
        res.json(formattedAssets);
    });

assetsRouter.post("/",
    upload.single("thumbnail"),
    checkThumbnail,
    async (req, res) => {
        const normalizedBody = {
            ...req.body,
            durationSec: Number(req.body.durationSec),
            nbUav: Number(req.body.nbUav),
        };
        const parsed = assetCreateTextFieldsSchema.safeParse(normalizedBody);
        if (!parsed.success) {
            return res.status(400).json({ error: "validation", issues: parsed.error.issues });
        } else if (!validateUniqueTags(parsed.data.tags)) {
            return res.status(400).json({ error: "validation", message: "Asset tags must be unique" });
        }

        const allowed = await checkProductionAssets(parsed.data);
        if (!allowed) {
            return res.status(400).json({ error: "validation", message: "In production, only demo assets are allowed" });
        }

        const assetDb = await prisma.asset.create({
            data: {
                ...parsed.data,
                type: formatAssetType(parsed.data.type),
            }
        })
        thumbnails.set(assetDb.thumbnail, res.locals.buffer);

        const asset: Asset = toAssetDTO(assetDb, assetDb.createdAt, assetDb.type);
        res.status(201).json(asset);
    });

assetsRouter.get("/thumbnail/:id",
    (req, res) => {
        const id = z.uuid().safeParse(req.params.id);
        if (!id.success) {
            return res.status(400).json({ error: "invalid id" });
        }
        const thumbnail = thumbnails.get(id.data);
        if (!thumbnail) {
            return res.status(404).json({ error: "not found" });
        }
        res.setHeader("Content-Type", "image/jpeg");
        res.send(thumbnail);
    });

if (process.env.NODE_ENV !== "production") {
    assetsRouter.put("/:id",
        validateAssetId,
        async (req, res) => {
            const parsed = assetUpdateSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ error: "validation", issues: parsed.error.issues });
            }
            if (!validateUniqueTags(parsed.data.tags)) {
                return res.status(400).json({ error: "validation", message: "Asset tags must be unique" });
            }

            const { type, ...rest } = parsed.data;
            const assetDb = await prisma.asset.update({
                where: { id: req.params.id },
                data: {
                    ...rest,
                    ...(type !== undefined ? { type: formatAssetType(type) } : {})
                },
            })

            const updatedAsset: Asset = toAssetDTO(assetDb, assetDb.createdAt, assetDb.type);
            res.json(updatedAsset);
        });

    assetsRouter.delete("/:id",
        validateAssetId,
        async (req, res) => {
            await prisma.asset.delete({ where: { id: req.params.id } });
            res.status(204).end();
        });
}

export { assetsRouter }