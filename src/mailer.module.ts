import { DynamicModule, Module, Provider } from "@nestjs/common";
import { BlacdotMailerService } from "./services/blacdot.mailer.service";
import { MailerConfig, MailerTemplateConfig } from "./dtos/mailer.options.interface";
import { MailerTransport } from "./transports/mailer.transport";
import { TransportType } from "./configs/constants";
import { TemplateService } from "./services/template.service";

@Module({})
export class BlacdotMailerModule {
  static forRoot(config: MailerConfig): DynamicModule {
    const transportProvider: Provider = {
      provide: "MAILER_TRANSPORT",
      useFactory: () => this.createTransport(config),
    };
    const providers:Provider[] = [transportProvider, BlacdotMailerService];
    if (config.templateConfig) {
      providers.push({
        provide: "TEMPLATE_SERVICE",
        useFactory: () => {
          return new TemplateService({...config.templateConfig} as MailerTemplateConfig);
        },
      });
    }
    return {
      module: BlacdotMailerModule,
      providers,
      exports: [BlacdotMailerService],
    };
  }

  static forRootAsync(config: MailerConfig): DynamicModule {
    const transportProvider: Provider = {
      provide: "MAILER_TRANSPORT",
      useFactory: () => this.createTransport(config),
    };
    const providers:Provider[] = [transportProvider, BlacdotMailerService];
    if (config.templateConfig) {
      providers.push({
        provide: "TEMPLATE_SERVICE",
        useFactory: () => {
          return new TemplateService({...config.templateConfig} as MailerTemplateConfig);
        },
      });
    }
    return {
      module: BlacdotMailerModule,
      providers,
      exports: [BlacdotMailerService],
    };
  }

  private static createTransport(config: MailerConfig) {
    const { transport, transportConfig } = config;
    const mailConfig = {
      ...transportConfig,
    };
    if (transport === TransportType.NODEMAILER && !mailConfig.host) {
      throw new Error("Host is required for nodemailer transport");
    }
    if (transport === TransportType.NODEMAILER) {
      return new MailerTransport({
        ...mailConfig,
        secure: mailConfig.secure || false,
        port: mailConfig.port || 465,
      });
    }
    if (transport === TransportType.GMAIL) {
      return new MailerTransport({
        ...mailConfig,
        host: mailConfig.host || "smtp.gmail.com",
        port: mailConfig.port || 465,
        secure: mailConfig.secure || true,
      });
    }
    if (transport === TransportType.MAILGUN) {
      return new MailerTransport({
        ...mailConfig,
        host: mailConfig.host || "smtp.mailgun.org",
        secure: mailConfig.secure || true,
      });
    }
    if (transport === TransportType.RESEND) {
      return new MailerTransport({
        ...mailConfig,
        host: mailConfig.host || "smtp.resend.com",
        secure: mailConfig.secure || true,
      });
    }
    if (transport === TransportType.MAILCHIMP) {
      return new MailerTransport({
        ...mailConfig,
        host: mailConfig.host || "smtp.mandrillapp.com",
        port: mailConfig.port || 587,
        secure: mailConfig.secure || true,
      });
    }
    if (transport === TransportType.TWILIO) {
      return new MailerTransport({
        ...mailConfig,
        host: mailConfig.host || "smtp.sendgrid.net",
        port: mailConfig.port || 587,
        secure: mailConfig.secure || true,
      });
    }
    if (transport === TransportType.SENDGRID) {
      return new MailerTransport({
        ...mailConfig,
        host: mailConfig.host || "smtp.sendgrid.net",
        port: mailConfig.port || 587,
        secure: mailConfig.secure || true,
      });
    }
    if (transport === TransportType.SENDINBLUE) {
      return new MailerTransport({
        ...mailConfig,
        host: mailConfig.host || "smtp.sendinblue.com",
        port: mailConfig.port || 587,
        secure: mailConfig.secure || true,
      });
    }
    throw new Error("Transport not supported");
  }
}
