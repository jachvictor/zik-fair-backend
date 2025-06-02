const nodemailer = require("nodemailer");

const sendEmail = async (email, token, header) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"ZikFair Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `ZikFair ${header}`,
      text: `Your ${header} is: ${token}\nThis token will expire in 24 hours.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 10px;">
          <h2 style="color: #4CAF50;">ZikFair ${header}</h2>
          <p>Your <strong>${header}</strong> is: 
            <span style="font-size: 18px; color: #333;">${token}</span>
          </p>
          <p style="color: gray;">This token will expire in 24 hours.</p>
        </div>
      `,
    });

    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Failed to send email:`, error);
  }
};

module.exports = sendEmail;
