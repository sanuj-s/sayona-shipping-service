const express = require("express");
const router = express.Router();

const {
    getTracking,
    updateTracking
} = require("../controllers/trackingController");

// PUBLIC route (NO authMiddleware)
router.get("/:trackingNumber", getTracking);

router.post("/update", updateTracking);

module.exports = router;
