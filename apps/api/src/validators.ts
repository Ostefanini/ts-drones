import * as z from "zod/v4";
import { AssetCreateDTO } from "@ts-drones/shared";
import { Request, Response, NextFunction } from "express";
import sharp from "sharp";

import { assets } from "./services/db.js";

// simple functions
export function validateUniqueTags(toValidate: AssetCreateDTO): boolean {
    if (!toValidate.tags) {
        return true;
    }
    const tagsSet = new Set(toValidate.tags);
    return tagsSet.size === toValidate.tags.length;
}

// as express middlewares
export function validateAssetId(req: Request, res: Response, next: NextFunction) {
    const id = z.uuid().safeParse(req.params.id);
    if (!id.success) {
        return res.status(400).json({ error: "invalid id" });
    }
    res.locals.assetIndex = assets.findIndex(a => a.id === id.data);
    if (res.locals.assetIndex === -1) {
        return res.status(404).json({ error: "not found" });
    }
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