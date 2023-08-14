import type {Config} from 'jest';

const config: Config = {
    roots: [
        "<rootDir>",
        "<rootDir>/tests",
    ],
    testMatch: [
        "**/__tests__/**/*.+(ts|tsx)",
        "**/?(*.)+(spec|test).+(ts|tsx)"
    ],
    transform: {
        "^.+\\.(t|j)sx?$": [
            "@swc/jest",
            {
                jsc: {
                    target: "es2022",
                },
            },
        ],
    },
    testEnvironment: 'node',
    modulePaths: ["<rootDir>", "<rootDir>/tests", "<rootDir>/src"],
    moduleDirectories: ["node_modules"],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    transformIgnorePatterns: ['node_modules/'],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
};

export default config;