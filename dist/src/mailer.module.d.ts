import { DynamicModule } from "@nestjs/common";
import { MailerConfig } from "./dtos/mailer.options.interface";
export declare class BlacdotMailerModule {
    static forRoot(config: MailerConfig): DynamicModule;
    static forRootAsync(config: MailerConfig): DynamicModule;
    private static createTransport;
}
