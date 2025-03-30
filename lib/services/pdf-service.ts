import jsPDF from 'jspdf';
import { InvoiceData } from '@/types/invoice';

export class PDFService {
  private generateHTML(data: InvoiceData): HTMLDivElement {
    // Create a temporary div to render the invoice
    const tempDiv = document.createElement('div');
    tempDiv.style.width = '650px'; // Match the width used in PDF generation
    
    // Clone the invoice template
    const invoiceTemplate = document.querySelector('[data-invoice-template]');
    if (invoiceTemplate) {
      tempDiv.appendChild(invoiceTemplate.cloneNode(true) as Node);
    }
    
    return tempDiv;
  }

  async generatePDF(data: InvoiceData, element?: HTMLDivElement): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfElement = element || this.generateHTML(data);

      await pdf.html(pdfElement, {
        callback: function (pdf) {
          pdf.save(
            `invoice_${data.invoiceNumber.replace(/\s+/g, '_')}.pdf`
          );
        },
        x: 10,
        y: 10,
        width: 190,
        windowWidth: 650,
      });
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      throw new Error('Failed to generate PDF');
    }
  }
}

let pdfService: PDFService | null = null;

export function getPDFService(): PDFService {
  if (!pdfService) {
    pdfService = new PDFService();
  }
  return pdfService;
} 