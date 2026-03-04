import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    await resend.emails.send({
      from: "WanderLust <onboarding@resend.dev>",
      to,
      subject,
      html
    });
    console.log("✅ Email sent successfully");
    return true;
  } catch (err) {
    console.error("❌ Email error:", err.message);
    throw err;
  }
};

export default sendEmail;