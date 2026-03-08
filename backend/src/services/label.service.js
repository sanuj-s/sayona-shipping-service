const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class LabelService {
    constructor() {
        this.labelsDir = path.join(__dirname, '..', '..', 'storage', 'labels');
        // Ensure directory exists
        if (!fs.existsSync(this.labelsDir)) {
            fs.mkdirSync(this.labelsDir, { recursive: true });
        }
    }

    /**
     * Generate a PDF shipping label for a shipment
     */
    async generateLabel(shipment) {
        try {
            return new Promise(async (resolve, reject) => {
                const doc = new PDFDocument({ size: 'A6', margin: 20 });
                const fileName = `label_${shipment.trackingNumber}.pdf`;
                const filePath = path.join(this.labelsDir, fileName);

                const stream = fs.createWriteStream(filePath);
                doc.pipe(stream);

                // Header
                doc.fontSize(20).font('Helvetica-Bold').text('SAYONA LOGISTICS', { align: 'center' });
                doc.moveDown(1);

                // Tracking Barcode placeholder (using text for now, could use jsbarcode)
                doc.fontSize(16).font('Courier-Bold').text(`*${shipment.trackingNumber}*`, { align: 'center' });
                doc.moveDown(1);

                // Details
                doc.fontSize(10).font('Helvetica');
                doc.text(`From: ${shipment.senderName}`);
                doc.text(`Origin: ${shipment.origin}`);
                doc.moveDown(0.5);

                doc.text(`To: ${shipment.receiverName}`);
                doc.text(`Destination: ${shipment.destination}`);
                doc.moveDown(0.5);

                doc.text(`Weight: ${shipment.weight || 'N/A'} kg | Service: ${shipment.shippingType || 'STANDARD'}`);

                // Add QR Code
                const qrDataUrl = await QRCode.toDataURL(`https://sayonashipping.com/track/${shipment.trackingNumber}`);
                doc.image(qrDataUrl, doc.page.width / 2 - 50, doc.y + 10, { width: 100 });

                doc.end();

                stream.on('finish', () => {
                    logger.info(`Generated label for ${shipment.trackingNumber} at ${filePath}`);
                    resolve(filePath);
                });

                stream.on('error', (err) => {
                    logger.error('Stream error generating label', err);
                    reject(err);
                });
            });
        } catch (error) {
            logger.error('Failed to generate label:', error);
            throw new Error('Label generation failed');
        }
    }
}

module.exports = new LabelService();
