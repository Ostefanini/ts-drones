import * as z from "zod/v4";
import { tagSchema } from "./tag";

export const assetTypeSchema = z.enum(["2d", "3d", "script"]);

export const assetSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  description: z.string().nullable().meta({ description: "optionnal" }),
  type: assetTypeSchema,
  priceEur: z.number().positive().nullable(),
  durationSec: z.number().int().positive().nullable(),
  tags: z.array(tagSchema).min(1),
  createdAt: z.iso.datetime(),
});

export const assetCreateSchema = assetSchema.omit({
  id: true,
  createdAt: true,
});

export const assetUpdateSchema = assetCreateSchema.partial();

export type Asset = z.infer<typeof assetSchema>;
export type AssetCreateDTO = z.infer<typeof assetCreateSchema>;
export type AssetUpdateDTO = z.infer<typeof assetUpdateSchema>;