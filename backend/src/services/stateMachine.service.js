const { SHIPMENT_STATUS, SHIPMENT_STATUS_TRANSITIONS } = require('../models/schemas');
const AppError = require('../utils/AppError');

class StateMachineService {

    /**
     * Determine if a transition from current to target status is permitted.
     */
    isValidTransition(currentStatus, targetStatus) {
        if (!currentStatus || !targetStatus) return false;

        const allowedTransitions = SHIPMENT_STATUS_TRANSITIONS[currentStatus];
        if (!allowedTransitions) return false;

        return allowedTransitions.includes(targetStatus);
    }

    /**
     * Validates transition and throws AppError if invalid
     */
    enforceTransition(currentStatus, targetStatus) {
        // First assignment
        if (!currentStatus && targetStatus === SHIPMENT_STATUS.CREATED) {
            return true;
        }

        if (currentStatus === targetStatus) {
            return true; // No-op
        }

        if (!this.isValidTransition(currentStatus, targetStatus)) {
            throw new AppError(
                `Invalid shipment state transition from ${currentStatus} to ${targetStatus}. Allowed states: ${SHIPMENT_STATUS_TRANSITIONS[currentStatus]?.join(', ') || 'None'}`,
                400
            );
        }

        return true;
    }
}

module.exports = new StateMachineService();
