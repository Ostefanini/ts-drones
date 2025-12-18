import { Asset, AssetType as AssetTypeZod } from "@ts-drones/shared";
import { AssetModel, AssetType as AssetTypeDB } from "../services/prisma.js";

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

const toAssetDTO = (assetDb: AssetModel, createdAt: Date, type: AssetTypeDB): Asset => {
    return {
        ...assetDb,
        createdAt: createdAt.toISOString(),
        type: formatAssetTypeReverse(type),
    };
}


export { formatAssetType, formatAssetTypeReverse, toAssetDTO };