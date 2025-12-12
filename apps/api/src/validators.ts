import * as z from "zod/v4";
import { AssetCreateDTO } from "@ts-drones/shared";
import { Request, Response, NextFunction } from "express";
import { assets } from "./services/db";

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