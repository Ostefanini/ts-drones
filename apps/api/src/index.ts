import express from "express";
import cors from "cors";
import {
    assetCreateSchema,
    assetUpdateSchema,
    type Asset,
} from "@ts-drones/shared";

const app = express();
app.use(cors());
app.use(express.json());

let assets: Asset[] = [];

app.get("/assets", (_req, res) => {
    res.json(assets);
});

app.post("/assets", (req, res) => {
    const parsed = assetCreateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "validation", issues: parsed.error.issues });
    }

    const now = new Date().toISOString();
    const newAsset: Asset = {
        id: crypto.randomUUID(),
        createdAt: now,
        ...parsed.data,
    };

    assets.push(newAsset);
    res.status(201).json(newAsset);
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`API http://localhost:${PORT}`);
});
