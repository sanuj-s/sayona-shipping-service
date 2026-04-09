// ─────────────────────────────────────────────
// Multi-Tenant Isolation Middleware 
// Associates all unprivileged requests to a tenant implicitly
// ─────────────────────────────────────────────

const tenantScope = (req, res, next) => {
    // Determine tenant_id from authorized user token gracefully,
    // intercepting scaling requests accurately. 
    // Defaults to tenant_id: 1 ('Sayona Primary') for backward compatibility
    
    req.tenantId = (req.user && req.user.tenant_id) ? req.user.tenant_id : 1;
    
    next();
};

module.exports = tenantScope;
