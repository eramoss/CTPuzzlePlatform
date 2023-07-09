import { Injectable } from '@nestjs/common';

@Injectable()
export class GeneratorService {
  generateNumberString(length: number): string {
    let generatedNumberString = '';
    for (let i = 0; i < length; i++) {
      generatedNumberString += Math.ceil(Math.random() * 9) + '';
    }
    return generatedNumberString;
  }
}
