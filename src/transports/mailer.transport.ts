import { IMailerTransport } from "../dtos/mailer.transport.options";
import { createTransport, Transporter } from "nodemailer";
import { MailMessageOptions, TransportConfig } from "../dtos/mailer.options.interface";

export class MailerTransport implements IMailerTransport {
  private transporter: Transporter;

  constructor(public config: TransportConfig) {
    this.transporter = createTransport({ ...config });
  }

  async sendMail(options: MailMessageOptions): Promise<any> {
    if (!options.from) options.from = this.config.defaults?.from;
    return this.transporter.sendMail(options);
  }
}
