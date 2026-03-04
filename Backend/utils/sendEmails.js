import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    const msg = {
      to,
      from: "raoshabrahul86@gmail.com", // your verified sender email
      subject,
      html
    };

    await sgMail.send(msg);
    console.log("✅ Email sent successfully");
    return true;
  } catch (err) {
    console.error("❌ Email error:", err.message);
    throw err;
  }
};

export default sendEmail;