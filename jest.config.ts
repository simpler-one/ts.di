import type {Config} from "@jest/types";


const config: Config.InitialOptions = {
    collectCoverage: true,
    coverageDirectory: "./coverage",
    globals: {
        "ts-jest": {
            tsconfig: "tsconfig.json",
        }
    },
    testMatch: [
        "**/*.spec.ts",
    ],
    transform: {
        "^.+\\.ts$": "ts-jest"
    },
    verbose: true,
};
export default config;
