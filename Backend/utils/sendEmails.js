import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "raoshabrahul86@gmail.com",
    pass: "fgfjwqwrtshsmpni", // Gmail App Password
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"WanderLust" <raoshabrahul86@gmail.com>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully");
    console.log("Message ID:", info.messageId);
  } catch (err) {
    console.error("❌ Email error:", err);
  }
};

export default sendEmail;