import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // 👇 verify connection with Gmail
    await transporter.verify();
    console.log("✅ Email transporter verified");

    const info = await transporter.sendMail({
      from: `"WanderLust" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log("✅ Email sent:", info.messageId);
    return true;
  } catch (err) {
    console.error("❌ Email error:", err.message);
    throw err; // VERY IMPORTANT
  }
};

export default sendEmail;
