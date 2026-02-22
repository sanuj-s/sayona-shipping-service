// Mock the logger to avoid console spam during tests
jest.mock('../src/config/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    http: jest.fn(),
}));

afterAll(async () => {
    // Close any open connections if needed
});
