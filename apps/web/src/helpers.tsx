import { type Asset } from '@ts-drones/shared'

export const computeAssetQueryParams = (playlist: Asset[]) => {
    return `assetOne=${playlist[0].name.toUpperCase()}${playlist[1] ? `&assetTwo=${playlist[1].name.toUpperCase()}` : ""}${playlist[2] ? `&assetThree=${playlist[2].name.toUpperCase()}` : ""}${playlist[3] ? `&assetFour=${playlist[3].name.toUpperCase()}` : ""}`
}