import pkg from "./package.json";
import tsOptions from "./tsconfig.json";

import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

const external = ["typescript", "rollup"];

const config = [
  {
    input: "./src/index.js",
    output: [
      { file: pkg.exports.import, format: "es" },
      { file: pkg.exports.require, format: "commonjs", exports: "named" },
      { file: pkg.exports.basic, format: "commonjs", exports: "named" },
      {
        file: pkg.exports.iife,
        format: "iife",
        name: "Translationary"
      }
    ],
    plugins: [typescript(tsOptions.compilerOptions)],
    external
  },
  {
    input: "./src/types/index.d.ts",
    output: [{ file: "dist/t.d.ts", format: "es" }],
    plugins: [dts()]
  }
];

export default config;
