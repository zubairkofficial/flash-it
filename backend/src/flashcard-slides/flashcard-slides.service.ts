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
    const getFlashCard = await FlashCardSlide.findAll({
      where: { flashcard_id: flashCardId },
    });
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    // const browser = await puppeteer.launch({

    //   args: [
    //     '--no-sandbox',
    //     '--disable-setuid-sandbox',
    //     '--disable-dev-shm-usage',
    //     '--single-process'
    //   ],
    //   timeout: 60000, // Increase to 60 seconds
    // });
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
          right: '15mm',
        },
      });

      return { pdfBuffer, getFlashCardTitles };
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
  
        html, body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 2rem;
          background-color: #ffffff;
          color: #333333;
          line-height: 1.6;
        }
  
        .slide-type-heading {
          font-size: 2rem;
          text-transform: uppercase;
          font-weight: 700;
          color: #F36B24;
          margin: 3rem 0 1.5rem;
          text-align: center;
          page-break-before: always;
        }
  
        .page {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 100vh;
          page-break-after: always;
        }
  
        .slide {
          margin: 1.5rem 0;
          border: 2px solid #F36B24;
          border-radius: 0.5rem;
          padding: 1.5rem;
          background-color: #fafafa;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
  
        .title {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 600;
          color: #F36B24;
          margin-bottom: 1rem;
        }
  
        .text {
          font-size: 1rem;
          text-align: center;
          padding: 0 10%;
          margin-bottom: 1rem;
        }
  
        .meta {
          font-size: 0.875rem;
          color: #777;
          text-align: right;
        }
  
        @media screen and (max-width: 768px) {
          body {
            padding: 1rem;
          }
  
          .slide {
            padding: 1rem;
          }
  
          .text {
            padding: 0 5%;
          }
  
          .slide-type-heading {
            font-size: 1.5rem;
          }
  
          .title {
            font-size: 1.25rem;
          }
        }
  
        @media print {
          body {
            padding: 0;
          }
  
          .slide {
            page-break-inside: avoid;
          }
  
          .slide-type-heading {
            page-break-before: always;
          }
  
          .page {
            page-break-after: always;
          }
        }
      </style>
    `;

    let lastSlideType = '';
    let body = '';

    slides.forEach((slide) => {
      const currentType = slide.slide_type;

      if (currentType !== lastSlideType) {
        body += `
          <div class="slide-type-heading">${currentType}</div>
        `;
        lastSlideType = currentType;
      }

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
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
