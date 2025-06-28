<h1 align="center">NestJS Mailer</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/@blacdot/nestjs-mailer" target="_blank">
    <img src="https://img.shields.io/npm/v/@blacdot/nestjs-mailer.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/package/@blacdot/nestjs-mailer" target="_blank">
    <img src="https://img.shields.io/npm/l/@blacdot/nestjs-mailer.svg" alt="Package License" />
  </a>
  <a href="https://github.com/semantic-release/semantic-release" target="_blank">
    <img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg" alt="Semantic Release" />
  </a>
</p>

A powerful, flexible email module featuring template support with Handlebars and seamless integration with various email
transport providers.

## Features

- Easy Integration: Seamless integration with various email transport providers
- Template Support: Built-in Handlebars template engine
- Multiple Transport Providers: Works with any Nodemailer transport
- Test-Friendly: Mock support for testing environments
- Type Safe: Fully typed with TypeScript
- Modular Design: Easy to extend and customize

## Installation

```bash
npm install @blacdot/nestjs-mailer
# or
yarn add @blacdot/nestjs-mailer
```

## Quick Start

1. **Install the required dependencies**:

```bash
npm install @blacdot/nestjs-mailer @nestjs/core @nestjs/common
```

2. **Create a simple application** (`app.ts`):

```typescript
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { MailerModule, MailerService, TransportType } from '@blacdot/nestjs-mailer';

@Module({
  imports: [
    MailerModule.forRoot({
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
    const mailerService = app.get(MailerService);

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
```

3. **Create a template file** (`templates/welcome.hbs`):

```handlebars
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Welcome Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }

        .content {
            padding: 20px;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
<div class="header">
    <h1>Welcome to {{company}}!</h1>
</div>
<div class="content">
    <p>Hello {{name}},</p>
    <p>Thank you for joining {{company}}. We're excited to have you on board!</p>
    <p>Here are some things you can do to get started:</p>
    <ul>
        <li>Complete your profile</li>
        <li>Explore our features</li>
        <li>Connect with other users</li>
    </ul>
    <p>If you have any questions, feel free to contact our support team.</p>
    <p>Best regards,<br>The {{company}} Team</p>
</div>
<div class="footer">
    &copy; {{year}} {{company}}. All rights reserved.
</div>
</body>
</html>
```

4. **Run the application**:

```bash
# Compile TypeScript
npx tsc app.ts --esModuleInterop

# Run the application
node app.js
```

## Template Usage

1. Create a template file (e.g., `templates/welcome.hbs`):

```handlebars

<div>
    <h1>Welcome, {{name}}!</h1>
    <p>Thank you for joining our service.</p>
</div>
```

2. Configure the template directory when initializing the mailer:

```typescript
import { join } from 'path';

const mailer = new Mailer({
  // ... transport config
  template: {
    dir: join(__dirname, 'templates'),
  },
});
```

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:cov
```

## Configuration Options

### Mailer Options

| Option      | Type                             | Description             |
|-------------|----------------------------------|-------------------------|
| `transport` | `Transport                       | TransportOptions`       | Nodemailer transport configuration |
| `defaults`  | `Mail.Options`                   | Default message options |
| `template`  | `{ dir: string, options?: any }` | Template configuration  |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Author

**Jamie Omondi**

- GitHub: [@jamie-codez](https://github.com/jamie-codez)
- Email: [Jamie Omondi](mailto:cruiseomondi90@gmail.com)

## Acknowledgments

- [Nodemailer](https://nodemailer.com/)
- [Handlebars](https://handlebarsjs.com/)

## License

Nest is [MIT licensed](./LICENSE).
