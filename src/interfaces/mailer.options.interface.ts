import { TransportType } from "../constants";

export interface MailerConfig {
  transport: TransportType;
  transportConfig: TransportConfig;
  templateConfig?: MailerTemplateConfig;
}

export interface MailerTemplateConfig {
  directory: string;
  engine: "hbs" | "handlebars";
  options: {
    [key: string]: any;
  };
}

export interface TransportConfig {
  auth: {
    user: string;
    pass: string;
  };
  secure?: boolean;
  host?: string;
  port?: number;
}

export interface MailMessageOptions {
  to: string;
  subject: string;
  from?: string;
  text?: string;
  html?: string;
  template?: string;
  attachments?: {
    filename: string;
    path: string;
  }[];
  context?: {
    [key: string]: any;
  };
}
