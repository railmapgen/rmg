module.exports = {
    roots: ['<rootDir>/src'],
    setupFiles: ['<rootDir>/src/setupTests.ts'],
    testEnvironment: 'jsdom',
    transformIgnorePatterns: ['/node_modules/(?!(@railmapgen/.*)|(nanoid))'],
    moduleNameMapper: {
        '\\.(css|less)$': 'identity-obj-proxy',
        '\\.(svg)$': 'jest-transform-stub',
    },
    resetMocks: true,
};
