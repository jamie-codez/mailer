import { Injectable, Optional, Inject } from "@nestjs/common";
import { IMailerTransport } from "../dtos/mailer.transport.options";
import { MailMessageOptions } from "../dtos/mailer.options.interface";
import { TemplateService } from "./template.service";

@Injectable()
export class BlacdotMailerService {
  constructor(
    @Inject("MAILER_TRANSPORT") private readonly mailerTransport: IMailerTransport,
    @Optional() @Inject("TEMPLATE_SERVICE") private readonly templateService?: TemplateService,
  ) {}

  async sendMail(options: MailMessageOptions): Promise<any> {
    if (options.template && this.templateService) {
      options.html = this.templateService.renderTemplate(options.template, { ...options.context });
    }

    if (options.html && options.html.includes("{{") && this.templateService) {
      options.html = this.templateService.renderStringTemplate(options.html, { ...options.context });
    }

    return this.mailerTransport.sendMail(options);
  }
}
