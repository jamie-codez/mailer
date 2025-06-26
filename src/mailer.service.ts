import { Injectable, Optional, Inject } from "@nestjs/common";
import { IMailerTransport } from "./interfaces/mailer.transport.options";
import { MailMessageOptions } from "./interfaces/mailer.options.interface";
import { TemplateService } from "./template.service";

@Injectable()
export class MailerService {
  constructor(
    @Inject("MAILER_TRANSPORT") private readonly mailerTransport: IMailerTransport,
    @Optional() @Inject("TEMPLATE_SERVICE") private readonly templateService?: TemplateService,
  ) {}

  async sendMail(options: MailMessageOptions): Promise<any> {
    // If a template service is required but not provided, throw an error
    if ((options.template || (options.html && options.html.includes("{{"))) && !this.templateService) {
      // Only allow mocking in test environment for specific test cases
      if (process.env.NODE_ENV === "test" && process.env.ALLOW_MOCK_TEMPLATES === 'true') {
        if (options.template) {
          options.html = `<h1>Mock template for ${options.template}</h1>`;
        } else {
          options.html = `<p>Mock string template</p>`;
        }
        if (options.context) {
          options.html += `<p>Context: ${JSON.stringify(options.context)}</p>`;
        }
      } else {
        throw new Error("Template service is not provided. Please provide a template service to use templates");
      }
    }

    if (options.template && this.templateService) {
      options.html = this.templateService.renderTemplate(options.template, { ...options.context });
    }

    if (options.html && options.html.includes("{{") && this.templateService) {
      options.html = this.templateService.renderStringTemplate(options.html, { ...options.context });
    }

    return this.mailerTransport.sendMail(options);
  }
}
