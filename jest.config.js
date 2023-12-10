export const preset = 'jest';
export const testEnvironment = 'node';
export const transform = {
    '^.+\\.ts?$': 'jest',
};
export const transformIgnorePatterns = ['<rootDir>/node_modules/'];
  