import { TransportType } from "../src/configs/constants";
import { BlacdotMailerModule, BlacdotMailerService } from "../src";
import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

@Module({
  imports: [
    BlacdotMailerModule.forRoot({
      transporter: TransportType.NODEMAILER, // Use the NodeMailer transport, when you use the other named transports (not nodemailer) just supply the auth and defaults(also optional) options in the transportConfig
      transport: {
        host: 'smtp.example.com', // Replace with your SMTP server
        port: 587,
        secure: false,
        defaults: {
          from: 'your-email@example.com', // Replace with your email, this will be used as the "from" address if not specified in the mailMessage object
        },
        auth: {
          user: 'your-email@example.com', // Replace with your email
          pass: 'your-password', // Replace with your password
        },
      },
      template: {
        directory: __dirname + '/templates', // Path to your templates
      },
    }),
  ],
})
class AppModule {}

async function bootstrap() {
  try {
    // Create the application
    const app = await NestFactory.createApplicationContext(AppModule);

    // Get the MailerService
    const mailerService = app.get(BlacdotMailerService);

    // Send an email using a template
    const result = await mailerService.sendMail({
      to: 'recipient@example.com', // Replace with recipient email
      subject: 'Welcome to Our Service',
      template: 'welcome', // This refers to welcome.hbs in the templates directory
      context: {
        name: 'John Doe',
        company: 'Acme Inc',
        year: new Date().getFullYear(),
      },
    });

    console.log('Email sent successfully!');
    console.log('Message ID:', result.messageId);

    // Close the application
    await app.close();
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

bootstrap();