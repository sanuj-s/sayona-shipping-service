const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const fs = require('fs');

const primarySpecPath = path.join(__dirname, '../../../swagger.yaml');
const fallbackSpecPath = path.join(__dirname, '../../../docs/swagger.yaml');
const specPath = fs.existsSync(primarySpecPath) ? primarySpecPath : fallbackSpecPath;
const swaggerDocument = YAML.load(specPath);

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

module.exports = router;
