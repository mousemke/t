/* eslint-disable import/unambiguous */
/* eslint-disable import/no-commonjs */
module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript"
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["import"],
  rules: {
    "import/no-unresolved": "error",
    "import/named": "error",
    "import/namespace": "error",
    "import/no-restricted-paths": "error",
    "import/no-absolute-path": "error",
    "import/no-dynamic-require": "error",
    "import/no-webpack-loader-syntax": "error",
    "import/export": "error",
    "import/no-named-as-default": "error",
    "import/no-named-as-default-member": "error",
    "import/no-deprecated": "warn",
    "import/no-extraneous-dependencies": "error",
    "import/no-mutable-exports": "error",
    "import/unambiguous": "error",
    "import/no-commonjs": "error",
    "import/no-amd": "error",
    "import/first": "error",
    "import/no-duplicates": "error",
    "import/no-namespace": "error",
    "import/newline-after-import": "error",
    "import/no-unassigned-import": "off",
    "import/no-named-default": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { ignoreRestSiblings: true }
    ],
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-expect-error": "allow-with-description",
        minimumDescriptionLength: 10
      }
    ]
  },
  settings: {
    "import/core-modules": ["puppeteer"],
    overrides: [
      {
        files: ["*.test.ts", "*.test.tsx"],
        rules: {
          "import/no-namespace": "off"
        }
      }
    ]
  }
};
/* eslint-enable */
