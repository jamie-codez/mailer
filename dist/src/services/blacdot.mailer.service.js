"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlacdotMailerService = void 0;
const common_1 = require("@nestjs/common");
const template_service_1 = require("./template.service");
let BlacdotMailerService = class BlacdotMailerService {
    mailerTransport;
    templateService;
    constructor(mailerTransport, templateService) {
        this.mailerTransport = mailerTransport;
        this.templateService = templateService;
    }
    async sendMail(options) {
        if (options.template && this.templateService) {
            options.html = this.templateService.renderTemplate(options.template, { ...options.context });
        }
        if (options.html && options.html.includes("{{") && this.templateService) {
            options.html = this.templateService.renderStringTemplate(options.html, { ...options.context });
        }
        return this.mailerTransport.sendMail(options);
    }
};
exports.BlacdotMailerService = BlacdotMailerService;
exports.BlacdotMailerService = BlacdotMailerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)("MAILER_TRANSPORT")),
    __param(1, (0, common_1.Optional)()),
    __param(1, (0, common_1.Inject)("TEMPLATE_SERVICE")),
    __metadata("design:paramtypes", [Object, template_service_1.TemplateService])
], BlacdotMailerService);
//# sourceMappingURL=blacdot.mailer.service.js.map