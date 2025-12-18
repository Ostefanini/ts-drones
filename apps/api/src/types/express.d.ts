import type { Asset } from "@prisma/client";
import { Sound } from "@ts-drones/shared";
import { Combination, User } from "../services/prisma";

declare global {
    namespace Express {
        interface Locals {
            asset?: Asset;
            assetOne?: AssetName;
            assetTwo?: AssetName;
            assetThree?: AssetName;
            assetFour?: AssetName;
            sound?: Sound;
            combination?: Combination & {
                foundBy: User;
            };
        }
    }
}

export { };
