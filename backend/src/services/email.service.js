const nodemailer = require('nodemailer');
const config = require('../config/environment');
const logger = require('../config/logger');

class EmailService {
    constructor() {
        // Initialize the transporter only if email credentials are provided
        if (config.email.user && config.email.pass) {
            this.transporter = nodemailer.createTransport({
                host: config.email.host,
                port: config.email.port,
                secure: config.email.port === 465,
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

    async sendPasswordResetEmail(email, resetToken) {
        if (!this.transporter) {
            logger.debug('Skipping sendPasswordResetEmail: Email transport disabled');
            return;
        }

        const resetLink = `${config.cors.origins[0]}/client/reset-password?token=${resetToken}`;
        
        const mailOptions = {
            from: `"Sayona Shipping Accounts" <${config.email.user}>`,
            to: email,
            subject: 'Password Reset Request',
            text: `You have requested to reset your password. Click the link below to reset it:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`
        };

        try {
            await this.transporter.sendMail(mailOptions);
            logger.info(`Password reset email sent successfully to ${email}`);
        } catch (error) {
            logger.error(`Failed to send reset email to ${email}`, { error: error.message });
        }
    }

    async sendVerificationEmail(email, verificationToken) {
        if (!this.transporter) {
            logger.debug('Skipping sendVerificationEmail: Email transport disabled');
            return;
        }

        const verifyLink = `${config.cors.origins[0]}/client/verify-email?token=${verificationToken}`;
        
        const mailOptions = {
            from: `"Sayona Shipping Accounts" <${config.email.user}>`,
            to: email,
            subject: 'Verify Your Email Address',
            text: `Welcome to Sayona Shipping! Please click the link below to verify your email address:\n\n${verifyLink}\n\nThis link will expire in 24 hours.`
        };

        try {
            await this.transporter.sendMail(mailOptions);
            logger.info(`Verification email sent successfully to ${email}`);
        } catch (error) {
            logger.error(`Failed to send verification email to ${email}`, { error: error.message });
        }
    }
}

module.exports = new EmailService();
