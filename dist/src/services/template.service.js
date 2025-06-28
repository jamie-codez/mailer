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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateService = void 0;
const common_1 = require("@nestjs/common");
const handlebars = require("handlebars");
const path = require("node:path");
const fs = require("node:fs");
let TemplateService = class TemplateService {
    directory;
    constructor(config) {
        handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
            switch (operator) {
                case "==":
                    return v1 == v2 ? options.fn(this) : options.inverse(this);
                case "===":
                    return v1 === v2 ? options.fn(this) : options.inverse(this);
                case "!=":
                    return v1 != v2 ? options.fn(this) : options.inverse(this);
                case "!==":
                    return v1 !== v2 ? options.fn(this) : options.inverse(this);
                case "<":
                    return v1 < v2 ? options.fn(this) : options.inverse(this);
                case "<=":
                    return v1 <= v2 ? options.fn(this) : options.inverse(this);
                case ">":
                    return v1 > v2 ? options.fn(this) : options.inverse(this);
                case ">=":
                    return v1 >= v2 ? options.fn(this) : options.inverse(this);
                case "&&":
                    return v1 && v2 ? options.fn(this) : options.inverse(this);
                case "||":
                    return v1 || v2 ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        });
        this.directory = config.directory;
    }
    renderTemplate(templateName, context) {
        const templatePath = path.join(this.directory, `${templateName}.hbs`);
        const templateSource = fs.readFileSync(templatePath, "utf8");
        const template = handlebars.compile(templateSource);
        return template(context);
    }
    renderStringTemplate(templateString, context) {
        return handlebars.compile(templateString)(context);
    }
};
exports.TemplateService = TemplateService;
exports.TemplateService = TemplateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], TemplateService);
//# sourceMappingURL=template.service.js.map