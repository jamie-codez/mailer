import { TransportType } from "../configs/constants";

export interface MailerConfig {
  transporter: TransportType;
  transport: TransportConfig;
  template?: MailerTemplateConfig;
}

export interface MailerTemplateConfig {
  directory: string;
  options?: {
    [key: string]: any;
  };
}

export interface TransportConfig {
  auth: {
    user: string;
    pass: string;
  };
  defaults?: {
    from: string;
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
