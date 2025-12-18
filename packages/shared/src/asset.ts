import * as z from "zod/v4";
import { tagSchema } from "./tag.js";

export const assetTypeSchema = z.enum(["2d", "3d", "script"]);

export const assetSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  thumbnail: z.uuid(), // refers to the thumbnail asset id stored separately
  video: z.url().nullable(),
  description: z.string(),
  type: assetTypeSchema,
  durationSec: z.number().nonnegative().nullable(),
  nbUav: z.number().nonnegative().nullable(),
  tags: z.array(tagSchema).min(1),
  createdAt: z.iso.datetime(),
});

// used only at runtime after multer upload, on req.body
export const assetCreateTextFieldsSchema = assetSchema.omit({
  id: true,
  createdAt: true,
  thumbnail: true,
});

export const assetUpdateSchema = assetCreateTextFieldsSchema.partial();
export const assetListSchema = assetSchema.array();

export type Asset = z.infer<typeof assetSchema>;
export type AssetType = z.infer<typeof assetTypeSchema>;
export type AssetCreateDTO = z.infer<typeof assetCreateTextFieldsSchema>;
export type AssetUpdateDTO = z.infer<typeof assetUpdateSchema>;
export type AssetListDTO = z.infer<typeof assetListSchema>;
