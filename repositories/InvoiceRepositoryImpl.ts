import { Invoice, CreateInvoiceDTO, UpdateInvoiceDTO } from '@/types/invoice/Invoice';
import { InvoiceRepository } from '@/types/invoice/InvoiceRepository';

export class InvoiceRepositoryImpl implements InvoiceRepository {
  private invoices: Invoice[] = [];

  async create(invoice: Invoice): Promise<Invoice> {
    this.invoices.push(invoice);
    return invoice;
  }

  async getById(id: string): Promise<Invoice | null> {
    return this.invoices.find(invoice => invoice.id === id) || null;
  }

  async getAll(): Promise<Invoice[]> {
    return [...this.invoices];
  }

  async update(id: string, invoice: UpdateInvoiceDTO): Promise<Invoice> {
    const index = this.invoices.findIndex(inv => inv.id === id);
    if (index === -1) {
      throw new Error('Invoice not found');
    }

    const updatedInvoice: Invoice = {
      ...this.invoices[index],
      ...invoice,
      updatedAt: new Date().toISOString(),
    };

    this.invoices[index] = updatedInvoice;
    return updatedInvoice;
  }

  async delete(id: string): Promise<void> {
    const index = this.invoices.findIndex(invoice => invoice.id === id);
    if (index !== -1) {
      this.invoices.splice(index, 1);
    }
  }

  async getByStatus(status: Invoice['status']): Promise<Invoice[]> {
    return this.invoices.filter(invoice => invoice.status === status);
  }
} 