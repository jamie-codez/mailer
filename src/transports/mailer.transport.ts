import { IMailerTransport } from "../interfaces/mailer.transport.options";
import { createTransport, Transporter } from "nodemailer";
import { MailMessageOptions, TransportConfig } from "../interfaces/mailer.options.interface";

export class MailerTransport implements IMailerTransport {
  private transporter: Transporter;

  constructor(config: TransportConfig) {
    this.transporter = createTransport({ ...config });
  }

  async sendMail(options: MailMessageOptions): Promise<any> {
    return this.transporter.sendMail(options);
  }
}
