import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Controller, Module, Post, Body, Injectable } from '@nestjs/common';
import * as request from 'supertest';
import * as path from 'path';
import * as fs from 'fs';
import { MailerModule } from '../src/mailer.module';
import { MailerService } from '../src/mailer.service';
import { TransportType } from '../src/constants';
import { MailMessageOptions } from '../src/interfaces/mailer.options.interface';

// Set NODE_ENV to 'test' for the MailerService to handle missing template service
process.env.NODE_ENV = 'test';
console.log('NODE_ENV set to:', process.env.NODE_ENV);

// Create a test controller that uses the MailerService
@Controller('email')
class EmailController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send')
  async sendEmail(@Body() emailData: MailMessageOptions) {
    try {
      const result = await this.mailerService.sendMail(emailData);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @Post('send-template')
  async sendTemplateEmail(@Body() emailData: MailMessageOptions) {
    try {
      // Make sure the template is set
      if (!emailData.template) {
        throw new Error('Template name is required');
      }

      const result = await this.mailerService.sendMail(emailData);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Create a dynamic module factory function to use the tempDir
function createTestAppModule(templatesDir: string) {
  @Module({
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
          directory: templatesDir,
          engine: 'handlebars',
          options: {},
        },
      }),
    ],
    controllers: [EmailController],
  })
  class TestAppModule {}

  return TestAppModule;
}

// Mock nodemailer to avoid actual email sending
jest.mock('nodemailer', () => {
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn().mockImplementation((mailOptions) => {
        return Promise.resolve({
          messageId: 'test-message-id-' + Date.now(),
          envelope: {
            from: mailOptions.from || 'default@example.com',
            to: [mailOptions.to],
          },
          accepted: [mailOptions.to],
          rejected: [],
          pending: [],
          response: '250 OK',
        });
      }),
    }),
  };
});

describe('Mailer Module (e2e)', () => {
  let app: INestApplication;
  let tempDir: string;

  beforeAll(async () => {
    // Create a temporary directory for templates
    tempDir = fs.mkdtempSync(path.join(__dirname, 'templates-'));

    // Create a test template
    const templateContent = '<h1>Hello {{name}}!</h1><p>Welcome to {{company}}.</p>';
    fs.writeFileSync(path.join(tempDir, 'welcome.hbs'), templateContent);
  });

  afterAll(() => {
    // Clean up the temporary directory
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  beforeEach(async () => {
    // Create a test module with our controller and the MailerModule
    const TestAppModule = createTestAppModule(tempDir);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestAppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/email/send (POST) - should send a simple email', () => {
    return request(app.getHttpServer())
      .post('/email/send')
      .send({
        to: 'recipient@example.com',
        subject: 'Test Email',
        html: '<p>This is a test email</p>',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.messageId).toContain('test-message-id-');
      });
  });

  it('/email/send (POST) - should send an email with string template', () => {
    return request(app.getHttpServer())
      .post('/email/send')
      .send({
        to: 'recipient@example.com',
        subject: 'Test Email with Template',
        html: '<p>Hello {{name}}, welcome to {{company}}!</p>',
        context: {
          name: 'John Doe',
          company: 'Acme Inc',
        },
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.messageId).toContain('test-message-id-');
      });
  });

  it('/email/send-template (POST) - should send an email with file template', () => {
    return request(app.getHttpServer())
      .post('/email/send-template')
      .send({
        to: 'recipient@example.com',
        subject: 'Welcome Email',
        template: 'welcome',
        context: {
          name: 'Jane Doe',
          company: 'Acme Inc',
        },
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true);
        expect(res.body.messageId).toContain('test-message-id-');
      });
  });

  it('/email/send-template (POST) - should return error when template is missing', () => {
    return request(app.getHttpServer())
      .post('/email/send-template')
      .send({
        to: 'recipient@example.com',
        subject: 'Welcome Email',
        context: {
          name: 'Jane Doe',
          company: 'Acme Inc',
        },
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Template name is required');
      });
  });
});
