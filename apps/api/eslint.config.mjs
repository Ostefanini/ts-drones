import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
    { ignores: ["node_modules/**", "dist/**", "src/generated/**"] },

    js.configs.recommended,

    ...tseslint.configs.recommended,

    {
        files: ["**/*.ts"],
        languageOptions: {
            parserOptions: {
                project: ["./tsconfig.test.json"],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            "@typescript-eslint/no-unused-vars":
                [
                    "warn", {
                        argsIgnorePattern: "^_",
                        caughtErrorsIgnorePattern: "^_",
                    }],
        },
    },
    {
        files: ["./openapi.ts"],
        languageOptions: { parserOptions: { project: null } }
    },
    {
        files: ["tests/**/*.ts"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
    }
];
