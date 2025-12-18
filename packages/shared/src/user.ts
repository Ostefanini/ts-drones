import * as z from "zod/v4";

export const userNicknameSchema = z.string().min(1).max(30).regex(/^[a-zA-Z0-9_]+$/);

export const userSchema = z.object({
    id: z.uuid(),
    nickname: userNicknameSchema,
});

export const userListHighscoreSchema = z.object({
    nickname: userNicknameSchema,
    nbCombinationsFound: z.number().nonnegative(),
});

export type UserNickname = z.infer<typeof userNicknameSchema>;
export type User = z.infer<typeof userSchema>;
export type UserListHighscore = z.infer<typeof userListHighscoreSchema>;