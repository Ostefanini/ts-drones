import * as z from "zod/v4";

export const tagSchema = z.string().min(1);

export type Tag = z.infer<typeof tagSchema>;