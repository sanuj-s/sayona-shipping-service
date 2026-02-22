// ─────────────────────────────────────────────
// Tracking Controller — HTTP handlers for tracking events
// ─────────────────────────────────────────────
const TrackingService = require('../services/tracking.service');
const { success, created } = require('../utils/responseHelper');
const { AUDIT_ACTIONS } = require('../models/schemas');

const getTracking = async (req, res, next) => {
    try {
        const data = await TrackingService.getHistory(req.params.trackingNumber);
        return success(res, data);
    } catch (error) {
        next(error);
    }
};

const addTrackingEvent = async (req, res, next) => {
    try {
        const event = await TrackingService.addEvent({
            ...req.body,
            userId: req.user.id,
        });

        await req.audit(AUDIT_ACTIONS.TRACKING_EVENT_ADDED, 'tracking_event', null, null, {
            trackingNumber: req.body.trackingNumber,
            status: req.body.status,
        });

        return created(res, event);
    } catch (error) {
        next(error);
    }
};

module.exports = { getTracking, addTrackingEvent };
