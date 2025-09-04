import { Injectable } from '@nestjs/common';
import { CreateFlashcardSlideDto } from './dto/flashcard-slide.dto';
import puppeteer from 'puppeteer';
import FlashCard from 'src/models/flashcard.model';
import FlashCardSlide from 'src/models/flashcard-slide.model';
import path from 'path';
import { writeFile } from 'fs/promises';
import FlashCardRawData from 'src/models/flashcard-raw-data.model';

@Injectable()
export class FlashcardSlidesService {
 async generateFlashCard(flashCardId: number) {
  const getFlashCardTitles = await FlashCardRawData.findAll({
  where: { flashcard_id: flashCardId },
  attributes: ['title'], // 👈 Select only the 'title' column
});
  const getFlashCard=await FlashCardSlide.findAll({where:{flashcard_id:flashCardId}})
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const html = this.generateSlideHtml(getFlashCard);
   

  try {
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm'
      }
    });

   
    return {pdfBuffer,getFlashCardTitles};

  } finally {
    await page.close();
    await browser.close();
  }
   
  }

  private generateSlideHtml(slides: any[]): string {
    const styles = `
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 30px;
          background: #fff;
          color: #333;
        }
        .slide {
          page-break-after: always;
          width:full;
          height:full;
          text:center;
          align-item:center;
          justify-content:center;
          margin-bottom: 40px;
          padding: 20px;
          border: 1px solid #F36B24;
          border-radius: 8px;
        }
        .title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
          color:#F36B24
        }
        .text {
          font-size: 16px;
        }
        .meta {
          font-size: 12px;
          color: #777;
          margin-top: 10px;
        }
      </style>
    `;
  
    const body = slides.map(slide => `
      <div class="slide">
        <div class="title">${slide.title || '(No title)'}</div>
        <div class="text">${slide.text || ''}</div>
        <div class="meta">
          Type: ${slide.slide_type} <br>
        </div>
      </div>
    `).join('');
  
    return `
      <html>
        <head>${styles}</head>
        <body>${body}</body>
      </html>
    `;
  }
  
  
  findAll() {
    return `This action returns all flashcardSlides`;
  }

  findOne(id: number) {
    return `This action returns a #${id} flashcardSlide`;
  }



  remove(id: number) {
    return `This action removes a #${id} flashcardSlide`;
  }
}
