export default {
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1'
    },
    transform: {
        '^.+\\.jsx?$': ['babel-jest', { configFile: './babel.config.cjs' }]
    },
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/**/*.test.{js,jsx}',
        '!src/main.jsx'
    ],
    coverageThresholds: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};
