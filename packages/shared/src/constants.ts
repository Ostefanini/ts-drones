import { AssetCreateDTO } from "./asset";

const cross: AssetCreateDTO = {
    name: "cross",
    video: "https://drive.google.com/file/d/1-mBMrv0zWrOqu3DhMh9OqjY-mpFBqyOY/preview",
    description: "A brilliant formation of cross-shaped drones.",
    type: "2d",
    durationSec: 2,
    nbUav: 12,
    tags: ["playstation"],
}

const circle: AssetCreateDTO = {
    name: "circle",
    video: "https://drive.google.com/file/d/1t9gpRGxepRR52eGweApXXaI2yC0lJ4rG/preview",
    description: "A brilliant formation of circle-shaped drones.",
    type: "2d",
    durationSec: 2,
    nbUav: 12,
    tags: ["playstation"],
}

const square: AssetCreateDTO = {
    name: "square",
    video: "https://drive.google.com/file/d/1vpClM23ibPXewKxsRNgrjv1r4axsp_fG/preview",
    description: "A brilliant formation of square-shaped drones.",
    type: "2d",
    durationSec: 2,
    nbUav: 12,
    tags: ["playstation"],
}

const triangle: AssetCreateDTO = {
    name: "triangle",
    video: "https://drive.google.com/file/d/1jmr0Iq2qsIvS9nqu-a6A6wK17jI1uIJ1/preview",
    description: "A brilliant formation of triangle-shaped drones.",
    type: "2d",
    durationSec: 2,
    nbUav: 12,
    tags: ["playstation"],
}

const demoPlaystationModels = [
    cross,
    circle,
    square,
    triangle,
]

export { demoPlaystationModels };