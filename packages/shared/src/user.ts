import * as z from "zod/v4";

export const userNicknameSchema = z.string().min(1).max(30).regex(/^[a-zA-Z0-9_]+$/);

export type UserNickname = z.infer<typeof userNicknameSchema>;