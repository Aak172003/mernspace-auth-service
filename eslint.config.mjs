// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    eslint.configs.recommended,
    // ...tseslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        ignores: [
            "dist",
            "node_modules",
            "eslint.config.mjs",
            "jest.config.js",
        ],
    },
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // no-console have 3 values : off, warn, error
            // off : no error
            // warn : warning
            // error : error
            "no-console": "off",
            // dot-notation is used to check if the property is accessed using dot notation
            "dot-notation": "error",
            "@typescript-eslint/no-misused-promises": "off",
        },
    },
);
