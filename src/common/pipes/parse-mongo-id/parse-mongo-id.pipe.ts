import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {

  transform(value: string, metadata: ArgumentMetadata) {
    if (!isValidObjectId(value)){
      throw new BadRequestException(`el valor ${value} no es un mongoID valido`)
    }
    return value;
  }
}
