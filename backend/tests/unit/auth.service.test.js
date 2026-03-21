// ─────────────────────────────────────────────
// Auth Service Unit Tests — Production-Grade
// Covers: token hashing, expiry enforcement,
// single-use invalidation, brute-force, lockout
// ─────────────────────────────────────────────
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Mock dependencies BEFORE requiring the service
jest.mock('../../src/config/database', () => ({
    query: jest.fn(),
    testConnection: jest.fn(),
}));
jest.mock('../../src/config/environment', () => ({
    security: { saltRounds: 10, maxLoginAttempts: 5, lockDurationMs: 1800000 },
    isDevelopment: jest.fn(() => true),
    isProduction: jest.fn(() => false),
    nodeEnv: 'test',
}));
jest.mock('../../src/repositories/user.repository');
jest.mock('../../src/services/token.service');

const AuthService = require('../../src/services/auth.service');
const UserRepository = require('../../src/repositories/user.repository');
const TokenService = require('../../src/services/token.service');
const config = require('../../src/config/environment');

// Helper: compute expected SHA-256 hash
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

describe('AuthService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        config.isDevelopment.mockReturnValue(true);
        config.isProduction.mockReturnValue(false);
    });

    // ─────────────── Registration ───────────────
    describe('register', () => {
        const validUser = { name: 'Test', email: 'test@example.com', password: 'Passw0rd!', phone: null, company: null };

        beforeEach(() => {
            UserRepository.emailExists.mockResolvedValue(false);
            UserRepository.create.mockResolvedValue({ id: 1, uuid: 'u-001', name: 'Test', email: 'test@example.com', role: 'client', is_verified: false });
            UserRepository.setVerificationToken.mockResolvedValue();
            TokenService.generateAccessToken.mockReturnValue('access-token');
            TokenService.generateRefreshToken.mockResolvedValue('refresh-token');
        });

        it('should hash verification token before storing', async () => {
            await AuthService.register(validUser);

            expect(UserRepository.setVerificationToken).toHaveBeenCalledWith(
                1,
                expect.stringMatching(/^[a-f0-9]{64}$/), // SHA-256 hash
                expect.any(Date)
            );
        });

        it('should set 24h expiry on verification token', async () => {
            const before = Date.now();
            await AuthService.register(validUser);
            const after = Date.now();

            const [, , expires] = UserRepository.setVerificationToken.mock.calls[0];
            const expiryMs = expires.getTime();
            const expectedMin = before + 24 * 60 * 60 * 1000;
            const expectedMax = after + 24 * 60 * 60 * 1000;

            expect(expiryMs).toBeGreaterThanOrEqual(expectedMin);
            expect(expiryMs).toBeLessThanOrEqual(expectedMax);
        });

        it('should NOT return verificationToken in production', async () => {
            config.isDevelopment.mockReturnValue(false);
            const result = await AuthService.register(validUser);
            expect(result.verificationToken).toBeUndefined();
        });

        it('should return verificationToken in development', async () => {
            const result = await AuthService.register(validUser);
            expect(result.verificationToken).toBeDefined();
            expect(typeof result.verificationToken).toBe('string');
        });

        it('should enforce client role for self-registration as admin', async () => {
            await AuthService.register({ ...validUser, role: 'admin' });
            expect(UserRepository.create).toHaveBeenCalledWith(
                expect.objectContaining({ role: 'client' })
            );
        });

        it('should throw ConflictError for duplicate email', async () => {
            UserRepository.emailExists.mockResolvedValue(true);
            await expect(AuthService.register(validUser)).rejects.toThrow('already exists');
        });

        it('stored hash should match hashed raw token', async () => {
            const result = await AuthService.register(validUser);
            const rawToken = result.verificationToken;
            const [, storedHash] = UserRepository.setVerificationToken.mock.calls[0];
            expect(storedHash).toBe(hashToken(rawToken));
        });
    });

    // ─────────────── Login ───────────────
    describe('login', () => {
        const mockUser = {
            id: 1, uuid: 'u-001', name: 'Test', email: 'test@example.com',
            password_hash: '$2b$10$hash', role: 'client', is_verified: true,
            is_locked: false, lock_until: null, failed_login_attempts: 0,
        };

        beforeEach(() => {
            UserRepository.findByEmail.mockResolvedValue(mockUser);
            UserRepository.resetLoginAttempts.mockResolvedValue();
            TokenService.generateAccessToken.mockReturnValue('access');
            TokenService.generateRefreshToken.mockResolvedValue('refresh');
        });

        it('should succeed with valid credentials', async () => {
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            const result = await AuthService.login('test@example.com', 'Passw0rd!');
            expect(result.accessToken).toBe('access');
            expect(result.user.email).toBe('test@example.com');
        });

        it('should throw for non-existent user', async () => {
            UserRepository.findByEmail.mockResolvedValue(null);
            await expect(AuthService.login('no@user.com', 'pass'))
                .rejects.toThrow('Invalid email or password');
        });

        it('should increment attempts on wrong password', async () => {
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
            UserRepository.incrementLoginAttempts.mockResolvedValue(1);
            await expect(AuthService.login('test@example.com', 'wrong'))
                .rejects.toThrow('Invalid email or password');
            expect(UserRepository.incrementLoginAttempts).toHaveBeenCalledWith(1);
        });

        it('should lock account after max attempts', async () => {
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
            UserRepository.incrementLoginAttempts.mockResolvedValue(5);
            UserRepository.lockAccount.mockResolvedValue();
            await expect(AuthService.login('test@example.com', 'wrong'))
                .rejects.toThrow();
            expect(UserRepository.lockAccount).toHaveBeenCalled();
        });

        it('should reject locked account with active lock', async () => {
            UserRepository.findByEmail.mockResolvedValue({
                ...mockUser,
                is_locked: true,
                lock_until: new Date(Date.now() + 60000),
            });
            await expect(AuthService.login('test@example.com', 'pass'))
                .rejects.toThrow();
        });

        it('should unlock expired lock and proceed', async () => {
            UserRepository.findByEmail.mockResolvedValue({
                ...mockUser,
                is_locked: true,
                lock_until: new Date(Date.now() - 1000),
            });
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            UserRepository.unlockAccount.mockResolvedValue();

            const result = await AuthService.login('test@example.com', 'Passw0rd!');
            expect(UserRepository.unlockAccount).toHaveBeenCalledWith(1);
            expect(result.accessToken).toBe('access');
        });
    });

    // ─────────────── Password Reset ───────────────
    describe('requestPasswordReset', () => {
        it('should hash token before storing', async () => {
            UserRepository.findByEmail.mockResolvedValue({ id: 1 });
            UserRepository.setPasswordResetToken.mockResolvedValue();

            await AuthService.requestPasswordReset('test@example.com');

            expect(UserRepository.setPasswordResetToken).toHaveBeenCalledWith(
                1,
                expect.stringMatching(/^[a-f0-9]{64}$/), // SHA-256 hash
                expect.any(Date)
            );
        });

        it('should set 1h expiry on reset token', async () => {
            UserRepository.findByEmail.mockResolvedValue({ id: 1 });
            UserRepository.setPasswordResetToken.mockResolvedValue();

            const before = Date.now();
            await AuthService.requestPasswordReset('test@example.com');

            const [, , expires] = UserRepository.setPasswordResetToken.mock.calls[0];
            expect(expires.getTime()).toBeGreaterThanOrEqual(before + 59 * 60 * 1000);
            expect(expires.getTime()).toBeLessThanOrEqual(before + 61 * 60 * 1000);
        });

        it('should NOT leak email existence for unknown emails', async () => {
            UserRepository.findByEmail.mockResolvedValue(null);
            const result = await AuthService.requestPasswordReset('nobody@example.com');
            expect(result.message).toContain('If an account exists');
        });

        it('should NOT return resetToken in production', async () => {
            config.isDevelopment.mockReturnValue(false);
            UserRepository.findByEmail.mockResolvedValue({ id: 1 });
            UserRepository.setPasswordResetToken.mockResolvedValue();

            const result = await AuthService.requestPasswordReset('test@example.com');
            expect(result.resetToken).toBeUndefined();
        });
    });

    // ─────────────── Password Reset Execution ───────────────
    describe('resetPassword', () => {
        it('should hash raw token before lookup', async () => {
            const rawToken = 'raw-reset-token';
            UserRepository.findByResetToken.mockResolvedValue({ id: 1 });
            UserRepository.updatePassword.mockResolvedValue();
            TokenService.revokeAllUserTokens.mockResolvedValue();

            await AuthService.resetPassword(rawToken, 'NewPassw0rd!');

            expect(UserRepository.findByResetToken).toHaveBeenCalledWith(
                hashToken(rawToken)
            );
        });

        it('should update password and revoke all tokens', async () => {
            UserRepository.findByResetToken.mockResolvedValue({ id: 1 });
            UserRepository.updatePassword.mockResolvedValue();
            TokenService.revokeAllUserTokens.mockResolvedValue();

            const result = await AuthService.resetPassword('token', 'NewPassw0rd!');
            expect(UserRepository.updatePassword).toHaveBeenCalledWith(1, expect.any(String));
            expect(TokenService.revokeAllUserTokens).toHaveBeenCalledWith(1);
            expect(result.message).toContain('reset successfully');
        });

        it('should reject invalid/expired token', async () => {
            UserRepository.findByResetToken.mockResolvedValue(null);
            await expect(AuthService.resetPassword('bad-token', 'NewPassw0rd!'))
                .rejects.toThrow('Invalid or expired');
        });
    });

    // ─────────────── Email Verification ───────────────
    describe('verifyEmail', () => {
        it('should hash raw token before lookup', async () => {
            const rawToken = 'verify-me';
            UserRepository.verifyEmail.mockResolvedValue({ id: 1, uuid: 'u-001', email: 'test@example.com' });

            await AuthService.verifyEmail(rawToken);

            expect(UserRepository.verifyEmail).toHaveBeenCalledWith(hashToken(rawToken));
        });

        it('should return success on valid token', async () => {
            UserRepository.verifyEmail.mockResolvedValue({ id: 1, uuid: 'u-001', email: 'test@example.com' });
            const result = await AuthService.verifyEmail('valid-token');
            expect(result.message).toContain('verified successfully');
            expect(result.email).toBe('test@example.com');
        });

        it('should reject invalid/expired token', async () => {
            UserRepository.verifyEmail.mockResolvedValue(null);
            await expect(AuthService.verifyEmail('bad-token'))
                .rejects.toThrow('Invalid or expired');
        });
    });
});
