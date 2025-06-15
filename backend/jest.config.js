export default {
  transform: {},
  moduleNameMapper: {
    "^@/(.*)\\.js$": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["js", "json"],
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.js"],
  testMatch: ["**/tests/**/*.test.js"],
  verbose: true,
  testTimeout: 10000,
  transformIgnorePatterns: [],
  moduleDirectories: ["node_modules", "src", "tests"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  injectGlobals: true,
};
