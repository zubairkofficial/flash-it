import { jsPDF } from 'jspdf';

export const generatePdfFileFromText=(text: string, filename: string = 'document.pdf')=> {
  const doc = new jsPDF();

  const lines = doc.splitTextToSize(text, 180); // Wrap text at 180mm
  doc.text(lines, 10, 10);

  const pdfBlob = doc.output('blob');
  return new File([pdfBlob], filename, { type: 'application/pdf' });
}
