module.exports = {
  rootDir: './',
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!types/*.{js,jsx,ts,tsx}',
  ],
};
