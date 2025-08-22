import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';

@Injectable({
  providedIn: 'root',
})
export class Pdf {
  constructor() {
    // Set worker path
    (
      pdfjsLib as any
    ).GlobalWorkerOptions.workerSrc = `/assets/pdf.worker.min.mjs`;
  }

  async extractText(file: File): Promise<string> {
    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
      fileReader.onload = async () => {
        try {
          const typedarray = new Uint8Array(fileReader.result as ArrayBuffer);

          const pdf = await (pdfjsLib as any).getDocument(typedarray).promise;
          let textContent = '';

          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const text = await page.getTextContent();

            text.items.forEach((item: any) => {
              textContent += item.str + ' ';
            });
          }

          resolve(textContent);
        } catch (err) {
          reject(err);
        }
      };

      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(file);
    });
  }
}
