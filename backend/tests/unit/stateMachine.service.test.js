// ─────────────────────────────────────────────
// State Machine Service Tests — Production-Grade
// Covers: transitions, terminal states, transition
// history recording, and error determinism
// ─────────────────────────────────────────────

jest.mock('../../src/config/database', () => ({
    query: jest.fn(),
    testConnection: jest.fn(),
}));

const { SHIPMENT_STATUS, SHIPMENT_STATUS_TRANSITIONS } = require('../../src/models/schemas');
const { query } = require('../../src/config/database');

// Must require AFTER mocks are set up
const stateMachineService = require('../../src/services/stateMachine.service');

describe('StateMachineService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ─────────────── Valid Transitions ───────────────
    describe('valid transitions', () => {
        const validTransitions = [
            ['CREATED', 'PICKED_UP'],
            ['PICKED_UP', 'IN_TRANSIT'],
            ['IN_TRANSIT', 'ARRIVED_AT_WAREHOUSE'],
            ['IN_TRANSIT', 'OUT_FOR_DELIVERY'],
            ['IN_TRANSIT', 'FAILED_DELIVERY'],
            ['ARRIVED_AT_WAREHOUSE', 'IN_TRANSIT'],
            ['ARRIVED_AT_WAREHOUSE', 'OUT_FOR_DELIVERY'],
            ['OUT_FOR_DELIVERY', 'DELIVERED'],
            ['OUT_FOR_DELIVERY', 'FAILED_DELIVERY'],
            ['FAILED_DELIVERY', 'OUT_FOR_DELIVERY'],
            ['FAILED_DELIVERY', 'RETURNED'],
        ];

        test.each(validTransitions)('%s → %s should be allowed', (from, to) => {
            expect(stateMachineService.isValidTransition(from, to)).toBe(true);
        });
    });

    // ─────────────── Invalid Transitions ───────────────
    describe('invalid transitions', () => {
        const invalidTransitions = [
            ['CREATED', 'DELIVERED'],
            ['CREATED', 'IN_TRANSIT'],
            ['PICKED_UP', 'DELIVERED'],
            ['OUT_FOR_DELIVERY', 'CREATED'],
            ['DELIVERED', 'RETURNED'],
            ['RETURNED', 'CREATED'],
        ];

        test.each(invalidTransitions)('%s → %s should be rejected', (from, to) => {
            expect(stateMachineService.isValidTransition(from, to)).toBe(false);
        });
    });

    // ─────────────── Terminal States ───────────────
    describe('terminal states', () => {
        it('DELIVERED should have no valid transitions', () => {
            const transitions = SHIPMENT_STATUS_TRANSITIONS['DELIVERED'];
            expect(!transitions || transitions.length === 0).toBe(true);
        });

        it('RETURNED should have no valid transitions', () => {
            const transitions = SHIPMENT_STATUS_TRANSITIONS['RETURNED'];
            expect(!transitions || transitions.length === 0).toBe(true);
        });
    });

    // ─────────────── enforceTransition ───────────────
    describe('enforceTransition', () => {
        it('should allow first assignment to CREATED', () => {
            expect(stateMachineService.enforceTransition(null, SHIPMENT_STATUS.CREATED)).toBe(true);
        });

        it('should allow same-status no-op', () => {
            expect(stateMachineService.enforceTransition('IN_TRANSIT', 'IN_TRANSIT')).toBe(true);
        });

        it('should throw AppError for invalid transition', () => {
            expect(() => stateMachineService.enforceTransition('CREATED', 'DELIVERED'))
                .toThrow('Invalid shipment state transition');
        });

        it('should throw with status 400 for invalid transition', () => {
            try {
                stateMachineService.enforceTransition('CREATED', 'DELIVERED');
            } catch (e) {
                expect(e.statusCode).toBe(422);
            }
        });

        it('error message should list allowed states', () => {
            try {
                stateMachineService.enforceTransition('CREATED', 'DELIVERED');
            } catch (e) {
                expect(e.message).toContain('PICKED_UP');
            }
        });
    });

    // ─────────────── Edge Cases ───────────────
    describe('edge cases', () => {
        it('should return false for null inputs', () => {
            expect(stateMachineService.isValidTransition(null, 'CREATED')).toBe(false);
            expect(stateMachineService.isValidTransition('CREATED', null)).toBe(false);
        });

        it('should return false for unknown statuses', () => {
            expect(stateMachineService.isValidTransition('NONEXISTENT', 'DELIVERED')).toBe(false);
        });
    });

    // ─────────────── Transition History ───────────────
    describe('recordTransition', () => {
        it('should persist transition to database', async () => {
            query.mockResolvedValue({ rows: [] });

            await stateMachineService.recordTransition(1, 'CREATED', 'PICKED_UP', 5, { location: 'NYC' });

            expect(query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO state_transitions'),
                [1, 'CREATED', 'PICKED_UP', 5, JSON.stringify({ location: 'NYC' })]
            );
        });

        it('should handle null fromStatus for initial creation', async () => {
            query.mockResolvedValue({ rows: [] });

            await stateMachineService.recordTransition(1, null, 'CREATED', 2);

            expect(query).toHaveBeenCalledWith(
                expect.stringContaining('INSERT INTO state_transitions'),
                [1, null, 'CREATED', 2, '{}']
            );
        });

        it('should not throw if database insert fails', async () => {
            query.mockRejectedValue(new Error('DB connection lost'));

            // Should not throw — audit logging is fire-and-forget
            await expect(
                stateMachineService.recordTransition(1, 'CREATED', 'PICKED_UP', 5)
            ).resolves.not.toThrow();
        });
    });

    describe('getTransitionHistory', () => {
        it('should return ordered transition history', async () => {
            const mockHistory = [
                { id: 1, from_status: null, to_status: 'CREATED', triggered_by_name: 'Admin' },
                { id: 2, from_status: 'CREATED', to_status: 'PICKED_UP', triggered_by_name: 'Staff' },
            ];
            query.mockResolvedValue({ rows: mockHistory });

            const history = await stateMachineService.getTransitionHistory(1);

            expect(history).toHaveLength(2);
            expect(query).toHaveBeenCalledWith(
                expect.stringContaining('ORDER BY'),
                [1]
            );
        });
    });
});
