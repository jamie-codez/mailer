"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerTransport = void 0;
const nodemailer_1 = require("nodemailer");
class MailerTransport {
    config;
    transporter;
    constructor(config) {
        this.config = config;
        this.transporter = (0, nodemailer_1.createTransport)({ ...config });
    }
    async sendMail(options) {
        if (!options.from)
            options.from = this.config.defaults?.from;
        return this.transporter.sendMail(options);
    }
}
exports.MailerTransport = MailerTransport;
//# sourceMappingURL=mailer.transport.js.map