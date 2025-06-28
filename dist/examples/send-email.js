"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../src/configs/constants");
const src_1 = require("../src");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            src_1.BlacdotMailerModule.forRoot({
                transporter: constants_1.TransportType.NODEMAILER,
                transport: {
                    host: 'smtp.example.com',
                    port: 587,
                    secure: false,
                    defaults: {
                        from: 'your-email@example.com',
                    },
                    auth: {
                        user: 'your-email@example.com',
                        pass: 'your-password',
                    },
                },
                template: {
                    directory: __dirname + '/templates',
                },
            }),
        ],
    })
], AppModule);
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.createApplicationContext(AppModule);
        const mailerService = app.get(src_1.BlacdotMailerService);
        const result = await mailerService.sendMail({
            to: 'recipient@example.com',
            subject: 'Welcome to Our Service',
            template: 'welcome',
            context: {
                name: 'John Doe',
                company: 'Acme Inc',
                year: new Date().getFullYear(),
            },
        });
        console.log('Email sent successfully!');
        console.log('Message ID:', result.messageId);
        await app.close();
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
}
bootstrap();
//# sourceMappingURL=send-email.js.map