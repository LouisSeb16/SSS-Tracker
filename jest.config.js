module.exports = {
  preset: 'jest-expo',
  // First run on a cold transform cache can exceed the 5s default.
  testTimeout: 20000,
  setupFiles: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/.expo/'],
};
