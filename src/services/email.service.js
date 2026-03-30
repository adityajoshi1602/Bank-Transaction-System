require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Bank System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log('Message sent:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

async function sendRegistrationEmail(name, useremail) {
    const subject = 'Welcome to Bank System';

    const text = `Hello ${name},

Thank you for registering with Bank System.

Your account has been successfully created. You can now securely log in and start using our services, including managing your account, tracking transactions, and accessing financial tools.

If you did not create this account, please contact our support team immediately.

Best regards,
Bank System Team`;

    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Welcome to Bank System, ${name} 👋</h2>
      <p>We’re glad to have you onboard.</p>
      <p>Your account has been <strong>successfully created</strong>. You can now:</p>
      <ul>
        <li>Access your dashboard</li>
        <li>Manage your account securely</li>
        <li>Track transactions</li>
        <li>Use banking features</li>
      </ul>
      <p>If you did not register for this account, please contact our support team immediately.</p>
      <hr />
      <p style="font-size: 14px; color: gray;">
        This is an automated message. Please do not reply directly to this email.
      </p>
      <p>— Bank System Team</p>
    </div>
  `;

    await sendEmail(useremail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
};