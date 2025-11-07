// backend/jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  roots: ['<rootDir>/src'],
  
  testMatch: [
    "**/__tests__/**/*.ts",
    "**/?(*.)+(spec|test).ts"
  ],
  
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      }
    }]
  },
  
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.test.ts",
    "!src/**/*.spec.ts",
    "!src/server.ts"
  ],
  
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testTimeout: 10000,
  
  // ✅ CRÍTICO: Forzar salida después de los tests
  forceExit: true,
  
  // ✅ Ejecutar tests en serie (un solo worker)
  maxWorkers: 1,
  
  // ✅ Opcional: para debugging
  // detectOpenHandles: true,
};

export default config;