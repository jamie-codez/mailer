import { MailerTemplateConfig } from "../dtos/mailer.options.interface";
export declare class TemplateService {
    private readonly directory;
    constructor(config: MailerTemplateConfig);
    renderTemplate(templateName: string, context: {
        [key: string]: any;
    }): string;
    renderStringTemplate(templateString: string, context: {
        [key: string]: any;
    }): string;
}
