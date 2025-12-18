import { Asset, AssetType as AssetTypeZod } from "@ts-drones/shared";
import { AssetModel, AssetType as AssetTypeDB } from "../services/prisma.js";
import { AssetName } from "../generated/prisma/index.js";

const formatAssetType = (assetType: AssetTypeZod): AssetTypeDB => {
    switch (assetType) {
        case "2d":
            return AssetTypeDB.TWO_D;
        case "3d":
            return AssetTypeDB.THREE_D;
        case "script":
            return AssetTypeDB.SCRIPT;
    }
}

const formatAssetTypeReverse = (assetType: AssetTypeDB): AssetTypeZod => {
    switch (assetType) {
        case AssetTypeDB.TWO_D:
            return "2d";
        case AssetTypeDB.THREE_D:
            return "3d";
        case AssetTypeDB.SCRIPT:
        default:
            return "script";
    }
}

const formatAssetName = (name: string): AssetName => {
    switch (name) {
        case "triangle":
            return AssetName.TRIANGLE;
        case "square":
            return AssetName.SQUARE;
        case "circle":
            return AssetName.CIRCLE;
        case "cross":
        default:
            return AssetName.CROSS;
    }
}

const formatAssetNameReverse = (name: AssetName): string => {
    switch (name) {
        case AssetName.TRIANGLE:
            return "triangle";
        case AssetName.SQUARE:
            return "square";
        case AssetName.CIRCLE:
            return "circle";
        case AssetName.CROSS:
        default:
            return "cross";
    }
}

const toAssetDTO = (assetDb: AssetModel, createdAt: Date, type: AssetTypeDB, name: AssetName): Asset => {
    return {
        ...assetDb,
        name: formatAssetNameReverse(name),
        createdAt: createdAt.toISOString(),
        type: formatAssetTypeReverse(type),
    };
}


export { formatAssetType, formatAssetTypeReverse, formatAssetName, formatAssetNameReverse, toAssetDTO };