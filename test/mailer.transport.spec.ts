import { MailerTransport } from '../src/transports/mailer.transport';
import { createTransport } from 'nodemailer';
import { MailMessageOptions, TransportConfig } from '../src/interfaces/mailer.options.interface';

// Mock nodemailer
jest.mock('nodemailer');

describe('MailerTransport', () => {
  let transport: MailerTransport;
  let mockNodemailerTransporter: any;

  const mockTransportConfig: TransportConfig = {
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
      user: 'test@example.com',
      pass: 'password123',
    },
  };

  beforeEach(() => {
    // Create mock for nodemailer transporter
    mockNodemailerTransporter = {
      sendMail: jest.fn().mockResolvedValue({
        messageId: 'test-message-id',
        envelope: {
          from: 'sender@example.com',
          to: ['recipient@example.com'],
        },
        accepted: ['recipient@example.com'],
        rejected: [],
        pending: [],
        response: '250 OK',
      }),
    };

    // Mock createTransport to return our mock transporter
    (createTransport as jest.Mock).mockReturnValue(mockNodemailerTransporter);

    // Create the transport instance
    transport = new MailerTransport(mockTransportConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(transport).toBeDefined();
  });

  it('should create a nodemailer transporter with the provided config', () => {
    expect(createTransport).toHaveBeenCalledWith(mockTransportConfig);
  });

  describe('sendMail', () => {
    it('should call the nodemailer transporter sendMail method with the provided options', async () => {
      const mailOptions: MailMessageOptions = {
        to: 'recipient@example.com',
        subject: 'Test Email',
        html: '<p>Hello World</p>',
        from: 'sender@example.com',
      };

      await transport.sendMail(mailOptions);

      expect(mockNodemailerTransporter.sendMail).toHaveBeenCalledWith(mailOptions);
    });

    it('should return the result from nodemailer sendMail', async () => {
      const mailOptions: MailMessageOptions = {
        to: 'recipient@example.com',
        subject: 'Test Email',
        html: '<p>Hello World</p>',
      };

      const result = await transport.sendMail(mailOptions);

      expect(result).toEqual({
        messageId: 'test-message-id',
        envelope: {
          from: 'sender@example.com',
          to: ['recipient@example.com'],
        },
        accepted: ['recipient@example.com'],
        rejected: [],
        pending: [],
        response: '250 OK',
      });
    });

    it('should handle errors from nodemailer', async () => {
      const mailOptions: MailMessageOptions = {
        to: 'recipient@example.com',
        subject: 'Test Email',
        html: '<p>Hello World</p>',
      };

      const error = new Error('Failed to send email');
      mockNodemailerTransporter.sendMail.mockRejectedValueOnce(error);

      await expect(transport.sendMail(mailOptions)).rejects.toThrow('Failed to send email');
    });

    it('should handle attachments in mail options', async () => {
      const mailOptions: MailMessageOptions = {
        to: 'recipient@example.com',
        subject: 'Test Email with Attachment',
        html: '<p>Hello World</p>',
        attachments: [
          {
            filename: 'test.txt',
            path: '/path/to/test.txt',
          },
        ],
      };

      await transport.sendMail(mailOptions);

      expect(mockNodemailerTransporter.sendMail).toHaveBeenCalledWith(mailOptions);
    });

    it('should handle text content in mail options', async () => {
      const mailOptions: MailMessageOptions = {
        to: 'recipient@example.com',
        subject: 'Test Email with Text',
        text: 'Hello World',
      };

      await transport.sendMail(mailOptions);

      expect(mockNodemailerTransporter.sendMail).toHaveBeenCalledWith(mailOptions);
    });

    it('should handle multiple recipients in mail options', async () => {
      const mailOptions: MailMessageOptions = {
        to: 'recipient1@example.com, recipient2@example.com',
        subject: 'Test Email with Multiple Recipients',
        html: '<p>Hello World</p>',
      };

      await transport.sendMail(mailOptions);

      expect(mockNodemailerTransporter.sendMail).toHaveBeenCalledWith(mailOptions);
    });
  });
});
