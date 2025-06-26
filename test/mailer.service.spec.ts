import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '../src/mailer.service';
import { MailMessageOptions } from '../src/interfaces/mailer.options.interface';

describe('MailerService', () => {
  let service: MailerService;
  let mockMailerTransport: any;
  let mockTemplateService: any;

  beforeEach(async () => {
    // Create mock implementations
    mockMailerTransport = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' }),
    };

    mockTemplateService = {
      renderTemplate: jest.fn().mockReturnValue('<p>Rendered template</p>'),
      renderStringTemplate: jest.fn().mockReturnValue('<p>Rendered string template</p>'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailerService,
        {
          provide: 'MAILER_TRANSPORT',
          useValue: mockMailerTransport,
        },
        {
          provide: 'TEMPLATE_SERVICE',
          useValue: mockTemplateService,
        },
      ],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendMail', () => {
    // Save original env vars
    const originalEnv = { ...process.env };

    afterEach(() => {
      // Restore original env vars after each test
      process.env = { ...originalEnv };
    });

    it('should send mail without template', async () => {
      // Ensure mock templates are not allowed for this test
      delete process.env.ALLOW_MOCK_TEMPLATES;
      const mailOptions: MailMessageOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Test content</p>',
      };

      await service.sendMail(mailOptions);

      expect(mockMailerTransport.sendMail).toHaveBeenCalledWith(mailOptions);
      expect(mockTemplateService.renderTemplate).not.toHaveBeenCalled();
      expect(mockTemplateService.renderStringTemplate).not.toHaveBeenCalled();
    });

    it('should render template when template option is provided', async () => {
      // Enable mock templates for this test
      process.env.ALLOW_MOCK_TEMPLATES = 'true';
      
      const mailOptions: MailMessageOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        template: 'welcome',
        context: { name: 'John' },
      };

      await service.sendMail(mailOptions);
      expect(mockTemplateService.renderTemplate).toHaveBeenCalledWith('welcome', { name: 'John' });
      expect(mockMailerTransport.sendMail).toHaveBeenCalledWith({
        ...mailOptions,
        html: '<p>Rendered template</p>',
      });
    });

    it('should render string template when html contains handlebars syntax', async () => {
      // Enable mock templates for this test
      process.env.ALLOW_MOCK_TEMPLATES = 'true';
      
      const mailOptions: MailMessageOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Hello {{name}}</p>',
        context: { name: 'John' },
      };

      await service.sendMail(mailOptions);

      expect(mockTemplateService.renderStringTemplate).toHaveBeenCalledWith('<p>Hello {{name}}</p>', { name: 'John' });
      expect(mockMailerTransport.sendMail).toHaveBeenCalledWith({
        ...mailOptions,
        html: '<p>Rendered string template</p>',
      });
    });

    it('should throw error when template is provided but template service is not available', async () => {
      // Create a service instance without a template service
      const moduleWithoutTemplateService: TestingModule = await Test.createTestingModule({
        providers: [
          MailerService,
          {
            provide: 'MAILER_TRANSPORT',
            useValue: mockMailerTransport,
          },
        ],
      }).compile();

      const serviceWithoutTemplateService = moduleWithoutTemplateService.get<MailerService>(MailerService);

      const mailOptions: MailMessageOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        template: 'welcome',
        context: { name: 'John' },
      };

      await expect(serviceWithoutTemplateService.sendMail(mailOptions)).rejects.toThrow(
        'Template service is not provided. Please provide a template service to use templates'
      );
    });

    it('should throw error when html contains handlebars syntax but template service is not available', async () => {
      // Create a service instance without a template service
      const moduleWithoutTemplateService: TestingModule = await Test.createTestingModule({
        providers: [
          MailerService,
          {
            provide: 'MAILER_TRANSPORT',
            useValue: mockMailerTransport,
          },
        ],
      }).compile();

      const serviceWithoutTemplateService = moduleWithoutTemplateService.get<MailerService>(MailerService);
      const mailOptions: MailMessageOptions = {
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<p>Hello {{name}}</p>',
        context: { name: 'John' },
      };
      await expect(serviceWithoutTemplateService.sendMail(mailOptions)).rejects.toThrow(
        'Template service is not provided. Please provide a template service to use templates'
      );
    });
  });
});