const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testMatch: ["**/tests/unit/**/*.test.ts?(x)"],
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
};
