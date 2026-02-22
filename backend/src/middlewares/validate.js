// ─────────────────────────────────────────────
// Validation Middleware — Joi schema runner
// ─────────────────────────────────────────────
const { ValidationError } = require('../utils/AppError');

/**
 * Validate request against Joi schema
 * @param {object} schema - Object with optional body, query, params Joi schemas
 * @returns {Function} Express middleware
 *
 * Usage: validate({ body: createShipmentSchema })
 */
const validate = (schema) => {
    return (req, res, next) => {
        const errors = [];

        for (const [source, joiSchema] of Object.entries(schema)) {
            if (!req[source]) continue;

            const { error, value } = joiSchema.validate(req[source], {
                abortEarly: false,
                stripUnknown: true,
                allowUnknown: false,
            });

            if (error) {
                error.details.forEach((detail) => {
                    errors.push({
                        field: detail.path.join('.'),
                        message: detail.message.replace(/"/g, ''),
                        source,
                    });
                });
            } else {
                // Replace request data with validated & sanitized data
                req[source] = value;
            }
        }

        if (errors.length > 0) {
            return next(new ValidationError('Validation failed', errors));
        }

        next();
    };
};

module.exports = validate;
