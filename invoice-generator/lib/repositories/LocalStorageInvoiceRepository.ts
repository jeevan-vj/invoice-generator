import { Invoice, CreateInvoiceDTO, UpdateInvoiceDTO } from '@/types/invoice/Invoice';
import { InvoiceRepository } from '@/types/invoice/InvoiceRepository';

const STORAGE_KEY = 'invoices';

export class LocalStorageInvoiceRepository implements InvoiceRepository {
  private getInvoices(): Invoice[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveInvoices(invoices: Invoice[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  }

  async create(invoice: CreateInvoiceDTO): Promise<Invoice> {
    const invoices = this.getInvoices();
    const newInvoice: Invoice = {
      ...invoice,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    invoices.push(newInvoice);
    this.saveInvoices(invoices);
    return newInvoice;
  }

  async getById(id: string): Promise<Invoice | null> {
    const invoices = this.getInvoices();
    return invoices.find(invoice => invoice.id === id) || null;
  }

  async getAll(): Promise<Invoice[]> {
    return this.getInvoices();
  }

  async update(id: string, invoice: UpdateInvoiceDTO): Promise<Invoice> {
    const invoices = this.getInvoices();
    const index = invoices.findIndex(inv => inv.id === id);
    
    if (index === -1) {
      throw new Error(`Invoice with id ${id} not found`);
    }

    const updatedInvoice: Invoice = {
      ...invoices[index],
      ...invoice,
      updatedAt: new Date().toISOString(),
    };

    invoices[index] = updatedInvoice;
    this.saveInvoices(invoices);
    return updatedInvoice;
  }

  async delete(id: string): Promise<void> {
    const invoices = this.getInvoices();
    const filteredInvoices = invoices.filter(invoice => invoice.id !== id);
    this.saveInvoices(filteredInvoices);
  }

  async getByStatus(status: Invoice['status']): Promise<Invoice[]> {
    const invoices = this.getInvoices();
    return invoices.filter(invoice => invoice.status === status);
  }
} 