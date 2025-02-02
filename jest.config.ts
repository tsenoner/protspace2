import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  preset: 'ts-jest',
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  testPathIgnorePatterns: ['<rootDir>/dist/', 'node_modules'],

  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    'node_modules/variables/.+\\.(j|t)sx?$': 'ts-jest'
  },

  transformIgnorePatterns: [
    'node_modules/(?!variables/.*)',
    'node_modules/(?!scatter-board-library/.*)',
    'node_modules/(?!molstar/.*)',
    'node_modules/molstar'
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sss|styl)$': '<rootDir>/styleMock.ts'
  }
};

export default config;
