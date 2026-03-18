const nodemailer = require('nodemailer');
const config = require('../config/environment');
const logger = require('../utils/logger');

class EmailService {
    constructor() {
        // Initialize the transporter only if email credentials are provided
        if (config.email.user && config.email.pass) {
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: config.email.user,
                    pass: config.email.pass,
                },
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
            from: `"${quote.name}" <${config.email.user}>`, // Appears from customer name but uses our authenticated email
            replyTo: quote.email,                            // Reply goes straight to the customer
            to: config.email.user,                           // Send to our own inbox
            subject: `New Quote Request: ${quote.origin || 'N/A'} to ${quote.destination || 'N/A'}`,
            text: `
You have received a new shipping quote request.

--- Customer Details ---
Name:    ${quote.name}
Email:   ${quote.email}
Phone:   ${quote.phone}
Company: ${quote.company || 'N/A'}

--- Shipment Details ---
Origin:      ${quote.origin || 'N/A'}
Destination: ${quote.destination || 'N/A'}
Cargo Type:  ${quote.cargo_type || 'N/A'}
Weight:      ${quote.weight || 'N/A'}

--- Message / Notes ---
${quote.message || 'No additional message provided.'}

---------------------------------------------------
View full quote details in the Sayona Admin Panel.
            `.trim(),
        };

        try {
            await this.transporter.sendMail(mailOptions);
            logger.info(`Quote notification email sent successfully for ${quote.uuid}`);
        } catch (error) {
            logger.error(`Failed to send quote notification for ${quote.uuid}`, { error: error.message });
            // Throw error to trigger a 500 response per requirements
            throw new Error('Failed to send the quote email notification');
        }
    }
}

module.exports = new EmailService();
