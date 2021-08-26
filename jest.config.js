module.exports = {
  rootDir: './src',
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!types/*.{js,jsx,ts,tsx}',
  ],
};
