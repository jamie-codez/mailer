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
    if (config.template) {
      providers.push({
        provide: "TEMPLATE_SERVICE",
        useFactory: () => {
          return new TemplateService({...config.template} as MailerTemplateConfig);
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
    if (config.template) {
      providers.push({
        provide: "TEMPLATE_SERVICE",
        useFactory: () => {
          return new TemplateService({...config.template} as MailerTemplateConfig);
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
    const { transporter, transport } = config;
    const mailConfig = {
      ...transport,
    };
    if (transporter === TransportType.NODEMAILER && !mailConfig.host) {
      throw new Error("Host is required for nodemailer transport");
    }
    if (transporter === TransportType.NODEMAILER) {
      return new MailerTransport({
        ...mailConfig,
        secure: mailConfig.secure || false,
        port: mailConfig.port || 465,
      });
    }
    if (transporter === TransportType.GMAIL) {
      return new MailerTransport({
        ...mailConfig,
        host: mailConfig.host || "smtp.gmail.com",
        port: mailConfig.port || 465,
        secure: mailConfig.secure || true,
      });
    }
    if (transporter === TransportType.MAILGUN) {
      return new MailerTransport({
        ...mailConfig,
        host: mailConfig.host || "smtp.mailgun.org",
        secure: mailConfig.secure || true,
      });
    }
    if (transporter === TransportType.RESEND) {
      return new MailerTransport({
        ...mailConfig,
        host: mailConfig.host || "smtp.resend.com",
        secure: mailConfig.secure || true,
      });
    }
    if (transporter === TransportType.MAILCHIMP) {
      return new MailerTransport({
        ...mailConfig,
        host: mailConfig.host || "smtp.mandrillapp.com",
        port: mailConfig.port || 587,
        secure: mailConfig.secure || true,
      });
    }
    if (transporter === TransportType.TWILIO) {
      return new MailerTransport({
        ...mailConfig,
        host: mailConfig.host || "smtp.sendgrid.net",
        port: mailConfig.port || 587,
        secure: mailConfig.secure || true,
      });
    }
    if (transporter === TransportType.SENDGRID) {
      return new MailerTransport({
        ...mailConfig,
        host: mailConfig.host || "smtp.sendgrid.net",
        port: mailConfig.port || 587,
        secure: mailConfig.secure || true,
      });
    }
    if (transporter === TransportType.SENDINBLUE) {
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
