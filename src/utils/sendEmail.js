
const sendEmail = async (options) => {
    try {
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `Fashionista's Haven <${process.env.EMAIL_FROM}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('SEND EMAIL ERROR:', error);
        throw new Error('Email could not be sent');
    }
};

module.exports = sendEmail;
