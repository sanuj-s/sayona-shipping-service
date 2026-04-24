const Joi = require('joi');
const schema = Joi.object({
    trackingNumber: Joi.string().trim().max(50).required(),
    senderName: Joi.string().trim().max(100).required(),
    receiverName: Joi.string().trim().max(100).required(),
    origin: Joi.string().trim().max(200).required(),
    destination: Joi.string().trim().max(200).required(),
    currentLocation: Joi.string().trim().max(200),
    industryType: Joi.string().trim().max(50),
    shippingType: Joi.string().valid('standard', 'express', 'same-day', 'international', 'ocean_fcl', 'ocean_lcl', 'air', 'ground').default('ocean_fcl'),
    weight: Joi.number().positive().max(10000),
    dimensions: Joi.string().max(100),
    userEmail: Joi.string().email().lowercase().trim(),
});

const payload = {
    senderName: "John Doe",
    senderEmail: "john@example.com",
    senderPhone: "1234567890",
    receiverName: "Jane Doe",
    receiverEmail: "jane@example.com",
    receiverPhone: "0987654321",
    origin: "India",
    destination: "france",
    weight: 50,
    cargoType: "textile",
    shippingType: "ocean_fcl",
    notes: "Special handling instructions...",
    trackingNumber: "SYN12345678",
    industryType: "textile"
};

const result = schema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
    allowUnknown: false,
});

if (result.error) {
    console.error("Validation failed:", result.error.details.map(d => d.message));
} else {
    console.log("Validation succeeded! Value:", result.value);
}
