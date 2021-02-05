import { Module } from "@nestjs/common";
import { GeneratorService } from "./generators.service";

@Module({
  providers: [GeneratorService],
  exports: [GeneratorService]
})
export class GeneratorModule { }
