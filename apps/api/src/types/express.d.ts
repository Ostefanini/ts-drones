import type { Asset } from "@prisma/client";

declare global {
    namespace Express {
        interface Locals {
            asset?: Asset;
        }
    }
}

export { };
