module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: '<rootDir>/setupTests.ts',
  moduleNameMapper: {
    '^@/core/(.*)$': '<rootDir>/src/$1',
  },
  modulePaths: ['<rootDir>'],
};
