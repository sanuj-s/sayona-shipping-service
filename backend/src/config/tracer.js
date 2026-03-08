const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const logger = require('./logger');

const initTracer = () => {
    // Only enable tracing if explicitly requested in environment
    if (process.env.ENABLE_TRACING !== 'true') return;

    logger.info(`[OpenTelemetry] Starting distributed tracer for ${process.env.SERVICE_NAME || 'monolith'}...`);

    const exporter = new JaegerExporter({
        endpoint: process.env.JAEGER_ENDPOINT || 'http://jaeger:14268/api/traces',
    });

    const sdk = new NodeSDK({
        serviceName: `sayona-${process.env.SERVICE_NAME || 'monolith'}-service`,
        traceExporter: exporter,
        instrumentations: [getNodeAutoInstrumentations()]
    });

    sdk.start();

    // Gracefully shut down the SDK on process exit
    process.on('SIGTERM', () => {
        sdk.shutdown()
            .then(() => logger.info('[OpenTelemetry] Tracing terminated'))
            .catch((error) => logger.error('Error terminating tracing', error))
            .finally(() => process.exit(0));
    });
};

initTracer();
