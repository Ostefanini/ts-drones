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

// used when creating a new asset along with the thumbnail file
export const assetCreateSchema = assetCreateTextFieldsSchema.extend({
  thumbnail: z
    .unknown()
    .meta({
      type: "string",
      format: "binary",
      description: "The asset thumbnail",
    })
})

export const assetUpdateSchema = assetCreateSchema.partial();

export type Asset = z.infer<typeof assetSchema>;
export type AssetCreateDTO = z.infer<typeof assetCreateTextFieldsSchema>;
export type AssetUpdateDTO = z.infer<typeof assetUpdateSchema>;