import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const errors = await validate(value);
    if (errors.length > 0) {
      throw new BadRequestException('Validación fallida: ' + JSON.stringify(errors));
    }
    return value;
  }
}
