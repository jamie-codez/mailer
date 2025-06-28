"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var BlacdotMailerModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlacdotMailerModule = void 0;
const common_1 = require("@nestjs/common");
const blacdot_mailer_service_1 = require("./services/blacdot.mailer.service");
const mailer_transport_1 = require("./transports/mailer.transport");
const constants_1 = require("./configs/constants");
const template_service_1 = require("./services/template.service");
let BlacdotMailerModule = BlacdotMailerModule_1 = class BlacdotMailerModule {
    static forRoot(config) {
        const transportProvider = {
            provide: "MAILER_TRANSPORT",
            useFactory: () => this.createTransport(config),
        };
        const providers = [transportProvider, blacdot_mailer_service_1.BlacdotMailerService];
        if (config.template) {
            providers.push({
                provide: "TEMPLATE_SERVICE",
                useFactory: () => {
                    return new template_service_1.TemplateService({ ...config.template });
                },
            });
        }
        return {
            module: BlacdotMailerModule_1,
            providers,
            exports: [blacdot_mailer_service_1.BlacdotMailerService],
        };
    }
    static forRootAsync(config) {
        const transportProvider = {
            provide: "MAILER_TRANSPORT",
            useFactory: () => this.createTransport(config),
        };
        const providers = [transportProvider, blacdot_mailer_service_1.BlacdotMailerService];
        if (config.template) {
            providers.push({
                provide: "TEMPLATE_SERVICE",
                useFactory: () => {
                    return new template_service_1.TemplateService({ ...config.template });
                },
            });
        }
        return {
            module: BlacdotMailerModule_1,
            providers,
            exports: [blacdot_mailer_service_1.BlacdotMailerService],
        };
    }
    static createTransport(config) {
        const { transporter, transport } = config;
        const mailConfig = {
            ...transport,
        };
        if (transporter === constants_1.TransportType.NODEMAILER && !mailConfig.host) {
            throw new Error("Host is required for nodemailer transport");
        }
        if (transporter === constants_1.TransportType.NODEMAILER) {
            return new mailer_transport_1.MailerTransport({
                ...mailConfig,
                secure: mailConfig.secure || false,
                port: mailConfig.port || 465,
            });
        }
        if (transporter === constants_1.TransportType.GMAIL) {
            return new mailer_transport_1.MailerTransport({
                ...mailConfig,
                host: mailConfig.host || "smtp.gmail.com",
                port: mailConfig.port || 465,
                secure: mailConfig.secure || true,
            });
        }
        if (transporter === constants_1.TransportType.MAILGUN) {
            return new mailer_transport_1.MailerTransport({
                ...mailConfig,
                host: mailConfig.host || "smtp.mailgun.org",
                secure: mailConfig.secure || true,
            });
        }
        if (transporter === constants_1.TransportType.RESEND) {
            return new mailer_transport_1.MailerTransport({
                ...mailConfig,
                host: mailConfig.host || "smtp.resend.com",
                secure: mailConfig.secure || true,
            });
        }
        if (transporter === constants_1.TransportType.MAILCHIMP) {
            return new mailer_transport_1.MailerTransport({
                ...mailConfig,
                host: mailConfig.host || "smtp.mandrillapp.com",
                port: mailConfig.port || 587,
                secure: mailConfig.secure || true,
            });
        }
        if (transporter === constants_1.TransportType.TWILIO) {
            return new mailer_transport_1.MailerTransport({
                ...mailConfig,
                host: mailConfig.host || "smtp.sendgrid.net",
                port: mailConfig.port || 587,
                secure: mailConfig.secure || true,
            });
        }
        if (transporter === constants_1.TransportType.SENDGRID) {
            return new mailer_transport_1.MailerTransport({
                ...mailConfig,
                host: mailConfig.host || "smtp.sendgrid.net",
                port: mailConfig.port || 587,
                secure: mailConfig.secure || true,
            });
        }
        if (transporter === constants_1.TransportType.SENDINBLUE) {
            return new mailer_transport_1.MailerTransport({
                ...mailConfig,
                host: mailConfig.host || "smtp.sendinblue.com",
                port: mailConfig.port || 587,
                secure: mailConfig.secure || true,
            });
        }
        throw new Error("Transport not supported");
    }
};
exports.BlacdotMailerModule = BlacdotMailerModule;
exports.BlacdotMailerModule = BlacdotMailerModule = BlacdotMailerModule_1 = __decorate([
    (0, common_1.Module)({})
], BlacdotMailerModule);
//# sourceMappingURL=mailer.module.js.map