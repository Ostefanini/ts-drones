import { z } from "zod";
export const assetTypeSchema = z.enum(["2d", "3d", "script"]);
export const assetStatusSchema = z.enum(["draft", "review", "published"]);
export const assetSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    type: assetTypeSchema,
    status: assetStatusSchema,
    priceEur: z.number().nullable(),
    durationSec: z.number().int().positive(),
    tags: z.array(z.string()),
    createdAt: z.string(), // ISO
});
export const assetCreateSchema = assetSchema.omit({
    id: true,
    createdAt: true,
});
export const assetUpdateSchema = assetCreateSchema.partial();
