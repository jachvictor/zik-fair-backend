const nodemailer = require("nodemailer");

const sendEmail = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "ZikFair Email Verification Code",
      html: `<p>Your verification token is: <strong>${token}</strong></p><p>This token will expire in 24 hours.</p>`,
    });

    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Failed to send email:`, error);
  }
};

module.exports = sendEmail;
