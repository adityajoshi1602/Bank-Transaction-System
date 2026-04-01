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

transporter.verify((error) => {
    if (error) {
        console.error('Email server error:', error);
    } else {
        console.log('Email server ready');
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
        console.error('Email error:', error);
    }
};


async function sendRegistrationEmail(name, useremail) {
    const subject = 'Welcome to Bank System';

    const text = `Hello ${name},
Your account has been created successfully. You can now log in and start using our services.`;

    const html = `
    <div style="font-family: Arial;">
        <h3>Welcome, ${name} 👋</h3>
        <p>Your account is ready.</p>
        <p>You can now log in and start using Bank System.</p>
    </div>
    `;

    await sendEmail(useremail, subject, text, html);
}


async function sendTransactionEmail(email, name, amount, toAccount) {
    const subject = 'Transaction Successful';

    const text = `Hello ${name},
Your transaction of ₹${amount} was successful.
Recipient: ${toAccount}`;

    const html = `
    <div style="font-family: Arial;">
        <h3>Transaction Successful ✅</h3>
        <p>Hi ${name},</p>
        <p>Your transfer of <strong>₹${amount}</strong> was completed successfully.</p>
        <p><strong>Recipient:</strong> ${toAccount}</p>
        <p>If this wasn’t you, contact support immediately.</p>
    </div>
    `;

    await sendEmail(email, subject, text, html);
}


async function sendTransactionFailureEmail(name, email, amount, reason) {
    const subject = 'Transaction Failed';

    const text = `Hello ${name},
Your transaction of ₹${amount} failed.
Reason: ${reason}`;

    const html = `
    <div style="font-family: Arial;">
        <h3>Transaction Failed ❌</h3>
        <p>Hi ${name},</p>
        <p>Your transaction of <strong>₹${amount}</strong> could not be completed.</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Please try again or contact support.</p>
    </div>
    `;

    await sendEmail(email, subject, text, html);
}


module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail,
};