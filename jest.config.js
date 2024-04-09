/**
 * @type {import("@jest/types").Config.ProjectConfig}
 */
module.exports = {
  testTimeout: 20 * 1000,
  transform: {
    ".(ts|tsx)": "ts-jest",
  },
  detectOpenHandles: true,
  // globalSetup: "./test/setup.ts",
  collectCoverageFrom: ["src/**/*.ts", "src/*.ts", "!**/node_modules/**"],
  coveragePathIgnorePatterns: ["node_modules/"],
  testEnvironment: "node",
  testRegex: ["test/.*\\.test\\.ts$"],
  roots: ["test"],
  moduleFileExtensions: ["ts", "js", "json"],
  // setupFiles: ["./test/setupTests.ts"],
  // reporters: ["default", "jest-sonar"]
};
