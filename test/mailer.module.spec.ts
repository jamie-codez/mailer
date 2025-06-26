import { Test } from '@nestjs/testing';
import { MailerModule } from '../src/mailer.module';
import { MailerService } from '../src/mailer.service';
import { TemplateService } from '../src/template.service';
import { MailerTransport } from '../src/transports/mailer.transport';
import { TransportType } from '../src/constants';

describe('MailerModule', () => {
  describe('forRoot', () => {
    it('should provide MailerService with transport', async () => {
      const module = await Test.createTestingModule({
        imports: [
          MailerModule.forRoot({
            transport: TransportType.NODEMAILER,
            transportConfig: {
              host: 'smtp.example.com',
              port: 587,
              secure: false,
              auth: {
                user: 'test@example.com',
                pass: 'password123',
              },
            },
          }),
        ],
      }).compile();

      const mailerService = module.get<MailerService>(MailerService);
      expect(mailerService).toBeDefined();
      
      // Verify the transport was created
      const transport = module.get('MAILER_TRANSPORT');
      expect(transport).toBeDefined();
      expect(transport).toBeInstanceOf(MailerTransport);
    });

    it('should provide TemplateService when templateConfig is provided', async () => {
      const module = await Test.createTestingModule({
        imports: [
          MailerModule.forRoot({
            transport: TransportType.NODEMAILER,
            transportConfig: {
              host: 'smtp.example.com',
              port: 587,
              secure: false,
              auth: {
                user: 'test@example.com',
                pass: 'password123',
              },
            },
            templateConfig: {
              directory: '/templates',
              engine: 'handlebars',
              options: {},
            },
          }),
        ],
      }).compile();

      const mailerService = module.get<MailerService>(MailerService);
      expect(mailerService).toBeDefined();
      
      // Verify the template service was created
      const templateService = module.get('TEMPLATE_SERVICE');
      expect(templateService).toBeDefined();
      expect(templateService).toBeInstanceOf(TemplateService);
    });

    it('should not provide TemplateService when templateConfig is not provided', async () => {
      const module = await Test.createTestingModule({
        imports: [
          MailerModule.forRoot({
            transport: TransportType.NODEMAILER,
            transportConfig: {
              host: 'smtp.example.com',
              port: 587,
              secure: false,
              auth: {
                user: 'test@example.com',
                pass: 'password123',
              },
            },
          }),
        ],
      }).compile();

      const mailerService = module.get<MailerService>(MailerService);
      expect(mailerService).toBeDefined();
      
      // Verify the template service was not created
      expect(() => module.get('TEMPLATE_SERVICE')).toThrow();
    });

    it('should throw error when host is not provided for NODEMAILER transport', async () => {
      await expect(
        Test.createTestingModule({
          imports: [
            MailerModule.forRoot({
              transport: TransportType.NODEMAILER,
              transportConfig: {
                auth: {
                  user: 'test@example.com',
                  pass: 'password123',
                },
              },
            }),
          ],
        }).compile()
      ).rejects.toThrow('Host is required for nodemailer transport');
    });

    it('should configure GMAIL transport with default host and port', async () => {
      const module = await Test.createTestingModule({
        imports: [
          MailerModule.forRoot({
            transport: TransportType.GMAIL,
            transportConfig: {
              auth: {
                user: 'test@gmail.com',
                pass: 'password123',
              },
            },
          }),
        ],
      }).compile();

      const transport = module.get('MAILER_TRANSPORT');
      expect(transport).toBeDefined();
      expect(transport).toBeInstanceOf(MailerTransport);
      // We can't directly test the private properties, but we can verify the transport was created
    });

    it('should configure MAILGUN transport with default host', async () => {
      const module = await Test.createTestingModule({
        imports: [
          MailerModule.forRoot({
            transport: TransportType.MAILGUN,
            transportConfig: {
              auth: {
                user: 'test@mailgun.com',
                pass: 'password123',
              },
            },
          }),
        ],
      }).compile();

      const transport = module.get('MAILER_TRANSPORT');
      expect(transport).toBeDefined();
      expect(transport).toBeInstanceOf(MailerTransport);
    });

    it('should configure RESEND transport with default host', async () => {
      const module = await Test.createTestingModule({
        imports: [
          MailerModule.forRoot({
            transport: TransportType.RESEND,
            transportConfig: {
              auth: {
                user: 'test@resend.com',
                pass: 'password123',
              },
            },
          }),
        ],
      }).compile();

      const transport = module.get('MAILER_TRANSPORT');
      expect(transport).toBeDefined();
      expect(transport).toBeInstanceOf(MailerTransport);
    });

    it('should configure MAILCHIMP transport with default host and port', async () => {
      const module = await Test.createTestingModule({
        imports: [
          MailerModule.forRoot({
            transport: TransportType.MAILCHIMP,
            transportConfig: {
              auth: {
                user: 'test@mailchimp.com',
                pass: 'password123',
              },
            },
          }),
        ],
      }).compile();

      const transport = module.get('MAILER_TRANSPORT');
      expect(transport).toBeDefined();
      expect(transport).toBeInstanceOf(MailerTransport);
    });

    it('should configure TWILIO transport with default host and port', async () => {
      const module = await Test.createTestingModule({
        imports: [
          MailerModule.forRoot({
            transport: TransportType.TWILIO,
            transportConfig: {
              auth: {
                user: 'test@twilio.com',
                pass: 'password123',
              },
            },
          }),
        ],
      }).compile();

      const transport = module.get('MAILER_TRANSPORT');
      expect(transport).toBeDefined();
      expect(transport).toBeInstanceOf(MailerTransport);
    });

    it('should configure SENDGRID transport with default host and port', async () => {
      const module = await Test.createTestingModule({
        imports: [
          MailerModule.forRoot({
            transport: TransportType.SENDGRID,
            transportConfig: {
              auth: {
                user: 'test@sendgrid.com',
                pass: 'password123',
              },
            },
          }),
        ],
      }).compile();

      const transport = module.get('MAILER_TRANSPORT');
      expect(transport).toBeDefined();
      expect(transport).toBeInstanceOf(MailerTransport);
    });

    it('should configure SENDINBLUE transport with default host and port', async () => {
      const module = await Test.createTestingModule({
        imports: [
          MailerModule.forRoot({
            transport: TransportType.SENDINBLUE,
            transportConfig: {
              auth: {
                user: 'test@sendinblue.com',
                pass: 'password123',
              },
            },
          }),
        ],
      }).compile();

      const transport = module.get('MAILER_TRANSPORT');
      expect(transport).toBeDefined();
      expect(transport).toBeInstanceOf(MailerTransport);
    });

    it('should throw error for unsupported transport', async () => {
      await expect(
        Test.createTestingModule({
          imports: [
            MailerModule.forRoot({
              transport: 'UNSUPPORTED' as TransportType,
              transportConfig: {
                auth: {
                  user: 'test@example.com',
                  pass: 'password123',
                },
              },
            }),
          ],
        }).compile()
      ).rejects.toThrow('Transport not supported');
    });
  });
});