import type { Response } from "express";

export function mustGetLocal<K extends keyof Express.Locals>(
    res: Response,
    key: K,
): NonNullable<Express.Locals[K]> {
    const value = res.locals[key];

    if (value == null) {
        const error = `Missing res.locals.${String(key)} (middleware not run?)`;
        console.error(error);
        throw new Error(error);
    }

    return value as NonNullable<Express.Locals[K]>;
}