import { Injectable } from "@nestjs/common";
import * as handlebars from "handlebars";
import * as path from "node:path";
import * as fs from "node:fs";
import { MailerTemplateConfig } from "./interfaces/mailer.options.interface";

@Injectable()
export class TemplateService {
  private readonly directory: string;

  constructor(config: MailerTemplateConfig) {
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

  renderTemplate(templateName: string, context: { [key: string]: any }): string {
    const templatePath = path.join(this.directory, `${templateName}.hbs`);
    const templateSource = fs.readFileSync(templatePath, "utf8");
    const template = handlebars.compile(templateSource);
    return template(context);
  }

  renderStringTemplate(templateString: string, context: { [key: string]: any }): string {
    return handlebars.compile(templateString)(context);
  }
}
