export default {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    transform: {
        '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.cjs' }]
    },
    transformIgnorePatterns: [
        'node_modules/(?!(.*\\.mjs$))'
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/**/*.test.{js,jsx}',
        '!src/main.jsx',
        '!src/**/*.spec.{js,jsx}'
    ],
    coverageThresholds: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    coverageReporters: ['text', 'lcov', 'html'],
    verbose: true
};
