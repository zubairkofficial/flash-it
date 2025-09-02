// pdf.service.ts

import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { DATA_TYPE } from './data-type.enum';
const pdfParse = require('pdf-parse');

@Injectable()
export class PdfService {
  async extractTextFromBuffer(buffer: Buffer): Promise<{title:string,text:string,data_type: DATA_TYPE}> {
    const data = await pdfParse(buffer);
    const title=await this.extractTitleFromBuffer(buffer)
    return {title:title,text:data.text,data_type:DATA_TYPE.FILE};
  }

  async extractTitleFromBuffer(buffer: Buffer): Promise<string> {
    const data = await pdfParse(buffer);

    const metadataTitle = data.info?.Title;
    if (metadataTitle) return metadataTitle;

    const lines = data.text.split('\n').map(line => line.trim()).filter(Boolean);
    return lines.length > 0 ? lines[0] : 'No title found';
  }
}
