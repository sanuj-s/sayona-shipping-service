const nodemailer = require('nodemailer');
const config = require('../config/environment');
const logger = require('../utils/logger');

class EmailService {
    constructor() {
        // Initialize the transporter only if email credentials are provided
        if (config.email.user && config.email.pass) {
            this.transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: config.email.user,
                    pass: config.email.pass,
                },
                connectionTimeout: 10000,  // 10s max to connect
                greetingTimeout: 10000,    // 10s max for SMTP greeting
                socketTimeout: 15000,      // 15s max for socket idle
            });
            logger.info('📧 EmailService initialized successfully');
        } else {
            logger.warn('⚠️  EmailService: EMAIL_USER or EMAIL_PASS missing. Emails will NOT be sent.');
            this.transporter = null;
        }
    }

    /**
     * Send an email notification when a new quote is requested
     * @param {Object} quote - The saved quote database object
     */
    async sendQuoteNotification(quote) {
        if (!this.transporter) {
            logger.debug('Skipping sendQuoteNotification: Email transport disabled');
            return;
        }

        const mailOptions = {
            from: `"Sayona Shipping" <${config.email.user}>`,
            replyTo: quote.email,
            to: config.email.user,
            subject: 'New Quote Request – Sayona Shipping',
            text: `
New Quote Request Received

Customer Details:
Name: ${quote.name}
Email: ${quote.email}
Phone: ${quote.phone || '-'}
Company: ${quote.company || '-'}

Shipment Details:
Origin Country: ${quote.origin || '-'}
Destination Country: ${quote.destination || '-'}
Cargo Type / Industry: ${quote.cargo_type || '-'}

Message:
${quote.message || '-'}

-----------------------------------
Submitted via sayonashipping.me
Time: ${new Date(quote.created_at || Date.now()).toISOString().replace('T', ' ').substring(0, 19)}
            `.trim(),
        };

        try {
            await this.transporter.sendMail(mailOptions);
            logger.info(`Quote notification email sent successfully for ${quote.uuid}`);
        } catch (error) {
            logger.error(`Failed to send quote notification for ${quote.uuid}`, { error: error.message });
            // Do NOT throw — quote is already saved, just log the failure
        }
    }
}

module.exports = new EmailService();
