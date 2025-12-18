import * as z from "zod/v4";
import { AssetCreateDTO, demoPlaystationModels, type Tag } from "@ts-drones/shared";
import { Request, Response, NextFunction } from "express";
import sharp from "sharp";

import { prisma } from "./services/prisma.js";
import _ from "lodash";

// simple functions
export function validateUniqueTags(tags: Tag[] | undefined): boolean {
    if (!tags) {
        return true;
    }
    const tagsSet = new Set(tags);
    return tagsSet.size === tags.length;
}

// as express middlewares
export async function validateAssetId(req: Request, res: Response, next: NextFunction) {
    const id = z.uuid().safeParse(req.params.id);
    if (!id.success) {
        return res.status(400).json({ error: "invalid id" });
    }
    const existingAsset = await prisma.asset.findUnique({ where: { id: id.data } });
    if (!existingAsset) {
        return res.status(404).json({ error: "not found" });
    }
    res.locals.asset = existingAsset;
    next();
}

export async function checkThumbnail(req: Request, res: Response, next: NextFunction) {
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

        res.locals.buffer = req.file.buffer;
        next();
    }
    catch (_err) {
        return res.status(400).json({ error: "validation", message: "Invalid thumbnail image" });
    };
}

export async function checkProductionAssets(data: AssetCreateDTO): Promise<boolean> {
    if (process.env.NODE_ENV !== "production") return true;

    const exists = await prisma.asset.findFirst({ where: { name: data.name } });

    return (
        exists === null &&
        Object.values(demoPlaystationModels).some(validModel =>
            _.isEqual(data, validModel)
        )
    );
}