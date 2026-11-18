import transporter from "./mailer.js";

const escapeHTML = (value = "") => {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
};

export const sendReplyEmail = async (reply) => {
  const { recipient_email, subject, message } = reply;

  if (!process.env.SMTP_USER) {
    throw new Error("SMTP_USER is not configured.");
  }

  if (!recipient_email) {
    throw new Error("Recipient email is missing.");
  }

  const safeMessage = escapeHTML(message).replace(/\n/g, "<br>");
  const safeSubject = escapeHTML(subject);

  const mailOptions = {
    from: {
      name: "Ebadullah Abid",
      address: process.env.SMTP_USER,
    },

    to: recipient_email,

    replyTo: process.env.SMTP_USER,

    subject,

    text: message,

    html: `
      <!DOCTYPE html>
      <html>
        <body style="
          margin: 0;
          padding: 30px;
          background: #f4f4f5;
          font-family: Arial, sans-serif;
          color: #18181b;
        ">
          <div style="
            max-width: 600px;
            margin: auto;
            padding: 30px;
            background: #ffffff;
            border-radius: 12px;
          ">
            <h2 style="margin-top: 0;">
              ${safeSubject}
            </h2>

            <div style="
              font-size: 15px;
              line-height: 1.8;
              color: #3f3f46;
            ">
              ${safeMessage}
            </div>

            <hr style="
              margin: 30px 0;
              border: none;
              border-top: 1px solid #e4e4e7;
            " />

            <p style="
              font-size: 14px;
              color: #71717a;
            ">
              Best regards,<br />
              <strong>Ebadullah Abid</strong><br />
              Developer
            </p>
          </div>
        </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};
