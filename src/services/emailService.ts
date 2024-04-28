import nodeMailer from "nodemailer";
import config from "../config/config";

const sendEmail = async ({ mailTo, subject, code, content }) => {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: config.SENDER_EMAIL,
            pass: config.SENDER_PASSWORD
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