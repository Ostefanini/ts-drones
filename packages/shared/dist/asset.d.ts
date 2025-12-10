import { z } from "zod";
export declare const assetTypeSchema: z.ZodEnum<["2d", "3d", "script"]>;
export declare const assetStatusSchema: z.ZodEnum<["draft", "review", "published"]>;
export declare const assetSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<["2d", "3d", "script"]>;
    status: z.ZodEnum<["draft", "review", "published"]>;
    priceEur: z.ZodNullable<z.ZodNumber>;
    durationSec: z.ZodNumber;
    tags: z.ZodArray<z.ZodString, "many">;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "script" | "2d" | "3d";
    id: string;
    status: "draft" | "review" | "published";
    priceEur: number | null;
    durationSec: number;
    tags: string[];
    createdAt: string;
}, {
    name: string;
    type: "script" | "2d" | "3d";
    id: string;
    status: "draft" | "review" | "published";
    priceEur: number | null;
    durationSec: number;
    tags: string[];
    createdAt: string;
}>;
export declare const assetCreateSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<["2d", "3d", "script"]>;
    status: z.ZodEnum<["draft", "review", "published"]>;
    priceEur: z.ZodNullable<z.ZodNumber>;
    durationSec: z.ZodNumber;
    tags: z.ZodArray<z.ZodString, "many">;
    createdAt: z.ZodString;
}, "id" | "createdAt">, "strip", z.ZodTypeAny, {
    name: string;
    type: "script" | "2d" | "3d";
    status: "draft" | "review" | "published";
    priceEur: number | null;
    durationSec: number;
    tags: string[];
}, {
    name: string;
    type: "script" | "2d" | "3d";
    status: "draft" | "review" | "published";
    priceEur: number | null;
    durationSec: number;
    tags: string[];
}>;
export declare const assetUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["2d", "3d", "script"]>>;
    status: z.ZodOptional<z.ZodEnum<["draft", "review", "published"]>>;
    priceEur: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    durationSec: z.ZodOptional<z.ZodNumber>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    type?: "script" | "2d" | "3d" | undefined;
    status?: "draft" | "review" | "published" | undefined;
    priceEur?: number | null | undefined;
    durationSec?: number | undefined;
    tags?: string[] | undefined;
}, {
    name?: string | undefined;
    type?: "script" | "2d" | "3d" | undefined;
    status?: "draft" | "review" | "published" | undefined;
    priceEur?: number | null | undefined;
    durationSec?: number | undefined;
    tags?: string[] | undefined;
}>;
export type AssetType = z.infer<typeof assetTypeSchema>;
export type AssetStatus = z.infer<typeof assetStatusSchema>;
export type Asset = z.infer<typeof assetSchema>;
export type AssetCreateDTO = z.infer<typeof assetCreateSchema>;
export type AssetUpdateDTO = z.infer<typeof assetUpdateSchema>;
