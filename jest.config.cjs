module.exports = {
  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // Update the transform section to use ts-jest for TypeScript files
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest',
  },

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['/node_modules/'],

  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },

  testEnvironment: 'jest-environment-jsdom',
};
