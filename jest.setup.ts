// jest-expo auto-mocks native modules, so expo-crypto returns undefined under Node.
// Back it with Node's own crypto so code that creates ids works in tests.
jest.mock('expo-crypto', () => ({
  randomUUID: () => jest.requireActual<{ randomUUID: () => string }>('node:crypto').randomUUID(),
}));
