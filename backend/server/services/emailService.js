const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.emv.EMAIL_PASS,
            },
        });
    }

    async sendMail(to, subject, text) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        await this.transporter.sendMail(mailOptions);
    }
}

module.exports = new EmailService();