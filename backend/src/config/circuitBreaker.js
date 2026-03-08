const CircuitBreaker = require('opossum');
const logger = require('../utils/logger');

// Common options for resilience against cascading external failures
const breakerOptions = {
    timeout: 3000,               // If action takes longer than 3 seconds, trigger a failure
    errorThresholdPercentage: 50, // When 50% of requests fail, trip the breaker
    resetTimeout: 30000          // After 30 seconds, try again
};

/**
 * Wraps any async function in an Opossum Circuit Breaker
 * @param {Function} action - Async function to execute
 * @param {string} name - Identifier for the breaker logging
 * @param {Object} fallback - Fallback payload or function if circuit trips
 */
const createCircuitBreaker = (action, name, fallback = null) => {
    const breaker = new CircuitBreaker(action, breakerOptions);

    breaker.fallback(() => {
        logger.warn(`[Circuit Breaker] Tripped for ${name}! Executing fallback.`);
        if (typeof fallback === 'function') return fallback();
        return fallback || { error: 'Service Unavailable (Circuit Open)', fallback: true };
    });

    breaker.on('open', () => logger.warn(`[Circuit Breaker] ${name} circuit is now OPEN (failing)`));
    breaker.on('halfOpen', () => logger.info(`[Circuit Breaker] ${name} circuit is HALF_OPEN (testing recovery)`));
    breaker.on('close', () => logger.info(`[Circuit Breaker] ${name} circuit is CLOSED (recovered)`));

    return breaker;
};

module.exports = { createCircuitBreaker };
