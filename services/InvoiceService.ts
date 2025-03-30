import { Invoice, CreateInvoiceDTO, UpdateInvoiceDTO } from '@/types/invoice/Invoice';
import { InvoiceRepository } from '@/types/invoice/InvoiceRepository';

export class InvoiceService {
  constructor(private repository: InvoiceRepository) {}

  async createInvoice(invoice: CreateInvoiceDTO): Promise<Invoice> {
    this.validateInvoice(invoice);
    return this.repository.create(invoice);
  }

  async getInvoice(id: string): Promise<Invoice | null> {
    return this.repository.getById(id);
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return this.repository.getAll();
  }

  async updateInvoice(id: string, invoice: UpdateInvoiceDTO): Promise<Invoice> {
    if (invoice) {
      this.validateInvoice(invoice as CreateInvoiceDTO);
    }
    return this.repository.update(id, invoice);
  }

  async deleteInvoice(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async getInvoicesByStatus(status: Invoice['status']): Promise<Invoice[]> {
    return this.repository.getByStatus(status);
  }

  private validateInvoice(invoice: CreateInvoiceDTO): void {
    if (!invoice.invoiceNumber) {
      throw new Error('Invoice number is required');
    }

    if (!invoice.customerName) {
      throw new Error('Customer name is required');
    }

    if (!invoice.customerEmail) {
      throw new Error('Customer email is required');
    }

    if (!invoice.items || invoice.items.length === 0) {
      throw new Error('At least one item is required');
    }

    if (invoice.taxRate < 0) {
      throw new Error('Tax rate cannot be negative');
    }

    if (invoice.total < 0) {
      throw new Error('Total amount cannot be negative');
    }

    // Validate dates
    const invoiceDate = new Date(invoice.date);
    const dueDate = new Date(invoice.dueDate);

    if (isNaN(invoiceDate.getTime())) {
      throw new Error('Invalid invoice date');
    }

    if (isNaN(dueDate.getTime())) {
      throw new Error('Invalid due date');
    }

    if (dueDate < invoiceDate) {
      throw new Error('Due date cannot be before invoice date');
    }
  }
} 