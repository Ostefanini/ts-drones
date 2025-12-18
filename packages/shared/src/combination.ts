import * as z from "zod/v4";
import { userNicknameSchema } from "./user";

export const soundSchema = z.enum(["healing", "emerveille", "glossy", "none"]);

export const combinationStatusSchema = z.object({
    exist: z.boolean(),
    foundBy: userNicknameSchema.nullable(),
});

export type CombinationStatus = z.infer<typeof combinationStatusSchema>;
export type Sound = z.infer<typeof soundSchema>;