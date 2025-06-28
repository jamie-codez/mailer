import { IMailerTransport } from "../dtos/mailer.transport.options";
import { MailMessageOptions, TransportConfig } from "../dtos/mailer.options.interface";
export declare class MailerTransport implements IMailerTransport {
    config: TransportConfig;
    private transporter;
    constructor(config: TransportConfig);
    sendMail(options: MailMessageOptions): Promise<any>;
}
