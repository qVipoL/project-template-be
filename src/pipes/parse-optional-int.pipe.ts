import { ArgumentMetadata, Injectable, ParseIntPipe } from '@nestjs/common';

@Injectable()
export class ParseOptionalIntPipe extends ParseIntPipe {
  async transform(value: string, metadata: ArgumentMetadata) {
    return value === undefined ? value : await super.transform(value, metadata);
  }
}
