import { createDefaultEsmPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultEsmPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node",
  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.ts$": ['ts-jest', {
      useESM: true,
      tsconfig: "<rootDir>/tsconfig.test.json"
    }],
    ...tsJestTransformCfg,
  },
};