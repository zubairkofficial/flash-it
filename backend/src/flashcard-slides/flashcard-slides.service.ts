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
      * {
        box-sizing: border-box;
      }
      body {
        font-family: Arial, sans-serif;
        padding: 40px;
        margin: 0;
        background: #fff;
        color: #333;
      }
  
      .slide-type-heading {
        font-size: 32px;
        text-transform: uppercase;
        font-weight: bold;
        color: #F36B24;
        margin: 20px 0 20px;
        text-align: center;
        page-break-before: always;
      }
  
      .page {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100vh;
        page-break-after: always;
      }
  
      .slide {
        flex: 1;
        margin: 10px 0;
        border: 1px solid #F36B24;
        border-radius: 8px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
  
      .title {
       text-align: center;
        font-size: 20px;
        font-weight: bold;
        color: #F36B24;
        margin-bottom: 10px;
      }
  
      .text {
        font-size: 16px;
        text-align: center;
        padding: 0 10%;
        margin-bottom: 10px;
      }
  
      .meta {
        font-size: 14px;
        color: #777;
        text-align: right;
      }
    </style>
  `;
  
  
  
    let lastSlideType = '';
    let body = '';
    
    slides.forEach((slide) => {
      const currentType = slide.slide_type;
    
      // Show heading if new group
      if (currentType !== lastSlideType) {
        body += `
          <div class="slide-type-heading">${currentType}</div>
        `;
        lastSlideType = currentType;
      }
    
      // Render the slide
      body += `
        <div class="slide">
          <div class="title">${slide.title || '(No title)'}</div>
          <div class="text">${slide.text || ''}</div>
          
        </div>
      `;
    });
    
  
    return `
      <html>
    <head>
      ${styles}
    </head>
    <body>
      ${body}
    </body>
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
