// ─────────────────────────────────────────────
// Tenant Controller — Billing, Usage, and Upgrades
// ─────────────────────────────────────────────
const { query, tenantStorage } = require('../config/database');
const { success } = require('../utils/responseHelper');
const { ForbiddenError, NotFoundError } = require('../utils/AppError');
const { AUDIT_ACTIONS } = require('../models/schemas');

/**
 * Get current usage vs limits
 */
const getUsage = async (req, res, next) => {
    try {
        const tenantId = tenantStorage.getStore() || req.user.tenant_id;
        
        const result = await query(
            `SELECT t.shipment_count, t.user_count, t.plan_id, t.status, 
                    p.shipment_limit, p.user_limit, p.name as plan_name, p.price
             FROM tenants t
             JOIN plans p ON t.plan_id = p.id
             WHERE t.id = $1`,
            [tenantId]
        );

        if (result.rows.length === 0) {
            throw new NotFoundError('Tenant not found');
        }

        return success(res, result.rows[0]);
    } catch (error) {
        next(error);
    }
};

/**
 * Mock upgrade plan endpoint
 */
const upgradePlan = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            throw new ForbiddenError('Only workspace admins can manage billing');
        }

        const tenantId = tenantStorage.getStore() || req.user.tenant_id;
        const { planId } = req.body;

        // Verify plan exists
        const planCheck = await query(`SELECT id FROM plans WHERE id = $1`, [planId]);
        if (planCheck.rows.length === 0) {
            throw new NotFoundError('Plan not found');
        }

        const result = await query(
            `UPDATE tenants SET plan_id = $1 WHERE id = $2 RETURNING plan_id`,
            [planId, tenantId]
        );

        await req.audit(AUDIT_ACTIONS.SYSTEM_CONFIG_UPDATED, 'tenant_plan', tenantId, null, {
            newPlan: planId
        });

        return success(res, { 
            message: `Successfully upgraded to ${planId}`,
            plan: result.rows[0].plan_id 
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsage,
    upgradePlan
};
