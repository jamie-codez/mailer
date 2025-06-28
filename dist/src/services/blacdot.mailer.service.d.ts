import { IMailerTransport } from "../dtos/mailer.transport.options";
import { MailMessageOptions } from "../dtos/mailer.options.interface";
import { TemplateService } from "./template.service";
export declare class BlacdotMailerService {
    private readonly mailerTransport;
    private readonly templateService?;
    constructor(mailerTransport: IMailerTransport, templateService?: TemplateService | undefined);
    sendMail(options: MailMessageOptions): Promise<any>;
}
