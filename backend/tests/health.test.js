const request = require('supertest');
const app = require('../src/app');
const { testConnection } = require('../src/config/database');

// Mock the database connection
jest.mock('../src/config/database', () => ({
    query: jest.fn(),
    testConnection: jest.fn(),
}));

describe('Health Check API', () => {
    it('should return 200 and healthy status when database is connected', async () => {
        testConnection.mockResolvedValueOnce(true);

        const res = await request(app).get('/api/v1/health');

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBe('healthy');
        expect(res.body.data.database).toBe('connected');
    });

    it('should return 503 when database is disconnected', async () => {
        testConnection.mockRejectedValueOnce(new Error('Connection failed'));

        const res = await request(app).get('/api/v1/health');

        expect(res.statusCode).toEqual(503);
        expect(res.body.success).toBe(false);
        expect(res.body.data.status).toBe('unhealthy');
        expect(res.body.data.database).toBe('disconnected');
    });
});
