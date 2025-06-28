/**
 * Example script to demonstrate how to use the mailer library
 * 
 * To run this example:
 * 1. Build the library: npm run build
 * 2. Compile this script: npx tsc examples/send-email.ts --esModuleInterop
 * 3. Run the compiled script: node examples/send-email.js
 */

import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { MailerModule } from '../src/mailer.module';
import { BlacdotMailerService } from '../src/services/blacdot.mailer.service';
import { TransportType } from '../src/configs/constants';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: TransportType.NODEMAILER,
      transportConfig: {
        host: 'smtp.example.com', // Replace with your SMTP server
        port: 587,
        secure: false,
        auth: {
          user: 'your-email@example.com', // Replace with your email
          pass: 'your-password', // Replace with your password
        },
      },
      templateConfig: {
        directory: __dirname + '/templates', // Path to your templates
        engine: 'handlebars',
        options: {},
      },
    }),
  ],
})
class AppModule {}

async function main() {
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

main();
