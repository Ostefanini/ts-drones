import express from "express";
import sharp from "sharp";
import * as z from "zod/v4";
import { type Asset, assetCreateTextFieldsSchema, assetUpdateSchema, demoPlaystationModels } from "@ts-drones/shared";

import { assets, thumbnails } from "./services/db";
import { validateAssetId, validateUniqueTags } from "./validators";
import { upload } from "./services/multer";
import _ from "lodash";

const assetsRouter = express.Router();

assetsRouter.get("/", (_req, res) => {
    res.json(assets);
});

assetsRouter.post("/",
    upload.single("thumbnail"),
    async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: "validation", message: "Thumbnail is required" });
        }
        try {
            const img = await sharp(req.file.buffer);
            const metadata = await img.metadata();
            const size = metadata.size;
            if (size === 0 || (metadata.size || 0) > 2000 * 1024) {
                return res.status(400).json({ error: "validation", message: "Thumbnail must be smaller than 2MB" });
            }
            if (metadata.format !== "jpeg" && metadata.format !== "png" && metadata.format !== "webp") {
                return res.status(400).json({ error: "validation", message: "Thumbnail must be a JPEG, PNG or WEBP image" });
            }
            const aspectRatio = metadata.width / (metadata.height || 1);
            if (aspectRatio < 16 / 10 || aspectRatio > 16 / 8) {
                return res.status(400).json({ error: "validation", message: "Thumbnail aspect ratio must be 16/9" });
            }
        }
        catch (_err) {
            return res.status(400).json({ error: "validation", message: "Invalid thumbnail image" });
        };

        const normalizedBody = {
            ...req.body,
            durationSec: Number(req.body.durationSec),
            nbUav: Number(req.body.nbUav),
        };
        req.body = normalizedBody;
        const parsed = assetCreateTextFieldsSchema.safeParse(normalizedBody);
        if (!parsed.success) {
            return res.status(400).json({ error: "validation", issues: parsed.error.issues });
        } else if (!validateUniqueTags(parsed.data)) {
            return res.status(400).json({ error: "validation", message: "Asset tags must be unique" });
        }
        if (process.env.NODE_ENV === "production") {
            let isAllowed = false;
            Object.values(demoPlaystationModels).forEach(validModel => {
                if (_.isEqual(parsed.data, validModel)
                    && assets.find(({ name }) => name === parsed.data.name) === undefined) {
                    isAllowed = true;
                }
            });
            if (!isAllowed) {
                return res.status(400).json({ error: "validation", message: "In production, only demo assets are allowed" });
            }
        }

        const imgUuid = crypto.randomUUID();
        thumbnails.set(imgUuid, req.file.buffer);
        const now = new Date().toISOString();
        const newAsset: Asset = {
            id: crypto.randomUUID(),
            createdAt: now,
            thumbnail: imgUuid,
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

assetsRouter.delete("/:id",
    validateAssetId,
    (_req, res) => {
        assets.splice(res.locals.assetIndex, 1);
        res.status(204).end();
    });

export { assetsRouter }