// @ts-check

/** @type {jest.InitialOptions} */
const config = {
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  moduleFileExtensions: ['ts', 'js', 'json'],
  preset: 'ts-jest/presets/js-with-ts',
  roots: ['<rootDir>/src'],
  transform: { '^.+\\.[jt]s$': 'ts-jest' },

  // By default, don't clutter `yarn test --watch` output with the full coverage table. To see it, use the
  // `--coverageReporters text` jest option.
  coverageReporters: ['json', 'lcov', 'text-summary'],
}

module.exports = config
