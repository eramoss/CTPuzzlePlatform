import { Module } from "@nestjs/common";
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./user.entity";
import { GeneratorModule } from "src/generators/generators.module";
import { MailerModule } from "src/mailer/mailer.module";
import ResearchGroup from "src/research-group/research-group.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, ResearchGroup]),
        GeneratorModule,
        MailerModule
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule { }
