import nodeMailer from "nodemailer";
import config from "../config/config";
import { decrypt } from "./encryptionService";


const decryptedEmail = decrypt(config.SENDER_EMAIL)
const decryptedPassword = decrypt(config.SENDER_PASSWORD)

const sendEmail = async ({ mailTo, subject, code, content }: SendEmailParams) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: decryptedEmail,
      pass: decryptedPassword
    }
  });

  const message = {
    to: mailTo,
    subject,
    html: `
        <div>
          <h3>Use this code to ${content}</h3>
          <p> Code: <strong>${code}</strong> </p> 
        </div>
      `
  }
  await transporter.sendMail(message);
}

export { sendEmail }


interface SendEmailParams {
  mailTo: string;
  subject: string;
  code: string | number;
  content: string;
}