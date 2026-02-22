// ─────────────────────────────────────────────
// Custom Error Hierarchy — Enterprise Error Taxonomy
// ─────────────────────────────────────────────

class AppError extends Error {
    constructor(message, statusCode = 500, errorCode = 'ERR_INTERNAL') {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message = 'Validation failed', details = []) {
        super(message, 400, 'ERR_VALIDATION');
        this.details = details;
    }
}

class AuthenticationError extends AppError {
    constructor(message = 'Authentication failed') {
        super(message, 401, 'ERR_AUTHENTICATION');
    }
}

class AuthorizationError extends AppError {
    constructor(message = 'Insufficient permissions') {
        super(message, 403, 'ERR_AUTHORIZATION');
    }
}

class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(`${resource} not found`, 404, 'ERR_NOT_FOUND');
    }
}

class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super(message, 409, 'ERR_CONFLICT');
    }
}

class RateLimitError extends AppError {
    constructor(message = 'Too many requests, please try again later') {
        super(message, 429, 'ERR_RATE_LIMIT');
    }
}

class AccountLockedError extends AppError {
    constructor(lockUntil) {
        super('Account is temporarily locked due to too many failed login attempts', 423, 'ERR_ACCOUNT_LOCKED');
        this.lockUntil = lockUntil;
    }
}

module.exports = {
    AppError,
    ValidationError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ConflictError,
    RateLimitError,
    AccountLockedError,
};
