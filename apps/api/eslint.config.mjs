import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
    { ignores: ["node_modules/**", "dist/**"] },

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
    }
];
