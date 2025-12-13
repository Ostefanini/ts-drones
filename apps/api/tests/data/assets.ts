import { type Asset } from "@ts-drones/shared";

const assetPayload = {
    name: "Asset #1",
    video: "https://example.com/video.mp4",
    description: "An example asset",
    type: "2d" as const,
    durationSec: 30,
    nbUav: 2,
    tags: [
        "tag1",
        "tag2"
    ]
};

const fullAsset: Asset = {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "createdAt": new Date().toISOString(),
    "thumbnail": "thumbnail-id",
    ...assetPayload
};

export { assetPayload, fullAsset };
