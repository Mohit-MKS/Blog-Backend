import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { AppConfigService } from '../../config/app-config.service';

export interface SendEmailParams {
  mailTo: string;
  subject: string;
  code: string | number;
  content: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: AppConfigService) {}

  async sendEmail({ mailTo, subject, code, content }: SendEmailParams): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: this.configService.senderEmail,
          pass: this.configService.senderPassword,
        },
      });

      const message = {
        from: this.configService.senderEmail,
        to: mailTo,
        subject,
        html: `
          <div>
            <h3>Use this code to ${content}</h3>
            <p>Code: <strong>${code}</strong></p> 
          </div>
        `,
      };

      await transporter.sendMail(message);
      this.logger.log(`Email successfully sent to ${mailTo}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${mailTo}`, (error as Error).stack);
      throw error;
    }
  }
}
