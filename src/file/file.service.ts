import { BadRequestException, Injectable } from '@nestjs/common';
import { UTApi } from 'uploadthing/server';

const utapi = new UTApi();

interface FileEsque extends Blob {
  name: string;
  customId?: string;
}

@Injectable()
export class FileService {
  constructor() {}

  async uploadFile(file: Express.Multer.File) {
    const blob = new Blob([file.buffer]);

    const uploadFile: FileEsque = Object.assign(blob, {
      name: file.originalname,
    });

    const response = await utapi.uploadFiles(uploadFile);

    if (!response.data) throw new BadRequestException('Failed to upload file');

    const { url } = response.data;

    return {
      url,
    };
  }
}
