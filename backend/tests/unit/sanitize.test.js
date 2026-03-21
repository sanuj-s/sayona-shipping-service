// ─────────────────────────────────────────────
// Input Sanitization Tests
// Validates HTML stripping, control char removal,
// and recursive object/array sanitization
// ─────────────────────────────────────────────

const sanitize = require('../../src/middlewares/sanitize');

describe('Sanitization Middleware', () => {
    const mockNext = jest.fn();
    const mockRes = {};

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const createReq = (body = {}, query = {}, params = {}) => ({ body, query, params });

    it('should strip HTML tags from body strings', () => {
        const req = createReq({ name: '<script>alert("xss")</script>John' });
        sanitize(req, mockRes, mockNext);
        expect(req.body.name).toBe('alert("xss")John');
        expect(mockNext).toHaveBeenCalled();
    });

    it('should strip HTML from query params', () => {
        const req = createReq({}, { search: '<b>bold</b> text' });
        sanitize(req, mockRes, mockNext);
        expect(req.query.search).toBe('bold text');
    });

    it('should strip HTML from route params', () => {
        const req = createReq({}, {}, { id: '<img src=x onerror=alert(1)>' });
        sanitize(req, mockRes, mockNext);
        expect(req.params.id).toBe('');
    });

    it('should strip control characters', () => {
        const req = createReq({ name: 'John\x00\x01\x02Doe' });
        sanitize(req, mockRes, mockNext);
        expect(req.body.name).toBe('JohnDoe');
    });

    it('should preserve normal newlines and tabs', () => {
        const req = createReq({ message: 'Line 1\nLine 2\tTabbed' });
        sanitize(req, mockRes, mockNext);
        expect(req.body.message).toBe('Line 1\nLine 2\tTabbed');
    });

    it('should handle nested objects recursively', () => {
        const req = createReq({
            user: {
                name: '<em>test</em>',
                address: { city: '<div>NYC</div>' },
            },
        });
        sanitize(req, mockRes, mockNext);
        expect(req.body.user.name).toBe('test');
        expect(req.body.user.address.city).toBe('NYC');
    });

    it('should handle arrays', () => {
        const req = createReq({ tags: ['<b>tag1</b>', '<i>tag2</i>'] });
        sanitize(req, mockRes, mockNext);
        expect(req.body.tags).toEqual(['tag1', 'tag2']);
    });

    it('should preserve non-string values', () => {
        const req = createReq({ count: 42, active: true, data: null });
        sanitize(req, mockRes, mockNext);
        expect(req.body.count).toBe(42);
        expect(req.body.active).toBe(true);
        expect(req.body.data).toBe(null);
    });

    it('should handle empty body gracefully', () => {
        const req = { body: undefined, query: {}, params: {} };
        sanitize(req, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('should trim whitespace from strings', () => {
        const req = createReq({ name: '  padded  ' });
        sanitize(req, mockRes, mockNext);
        expect(req.body.name).toBe('padded');
    });

    it('should strip complex XSS payloads', () => {
        const req = createReq({
            input: '<img src="x" onerror="alert(document.cookie)"><a href="javascript:void(0)">click</a>',
        });
        sanitize(req, mockRes, mockNext);
        expect(req.body.input).not.toContain('<');
        expect(req.body.input).not.toContain('>');
    });
});
