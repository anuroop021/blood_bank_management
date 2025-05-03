// jest.config.js
module.exports = {
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
  
    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,
  
    // The directory where Jest should output its coverage files
    coverageDirectory: "coverage",
  
    // The test environment that will be used for testing
    testEnvironment: "jsdom",
  
    // Transform files with babel-jest
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest"
    },
  
    // Mock CSS imports
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
      "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js"
    },
  
    // Important for solving the axios import error:
    transformIgnorePatterns: [
      "/node_modules/(?!axios)/"
    ],
  
    // Setup files to run before tests
    setupFilesAfterEnv: [
      "<rootDir>/src/setupTests.js"
    ]
  };