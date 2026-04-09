const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Sayona Shipping Architecture API',
            version: '2.0.0',
            description: 'Enterprise API for internal ops and public integrations',
        },
        servers: [{ url: '/api/v1' }],
    },
    apis: [path.join(__dirname, '*.js')],
};

const swaggerDocument = swaggerJsdoc(options);

router.use('/', swaggerUi.serve);
// Allow UI rendering
router.get('/', swaggerUi.setup(swaggerDocument));
// Expose pure JSON output for openapi-typescript client-gen
router.get('/schema.json', (req, res) => res.json(swaggerDocument));

module.exports = router;
