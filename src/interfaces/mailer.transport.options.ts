import { MailMessageOptions } from "./mailer.options.interface";

export interface IMailerTransport {
  sendMail(options: MailMessageOptions): Promise<any>;
}
