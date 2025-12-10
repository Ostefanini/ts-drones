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

export type AssetType = z.infer<typeof assetTypeSchema>;
export type AssetStatus = z.infer<typeof assetStatusSchema>;
export type Asset = z.infer<typeof assetSchema>;
export type AssetCreateDTO = z.infer<typeof assetCreateSchema>;
export type AssetUpdateDTO = z.infer<typeof assetUpdateSchema>;
