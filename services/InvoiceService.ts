import { Invoice, CreateInvoiceDTO, UpdateInvoiceDTO, Payment } from '@/types/invoice/Invoice';
import { InvoiceRepository } from '@/types/invoice/InvoiceRepository';
import { InvoiceRepositoryImpl } from '@/repositories/InvoiceRepositoryImpl';

export class InvoiceService {
  constructor(private repository: InvoiceRepository) {}

  async createInvoice(data: CreateInvoiceDTO): Promise<Invoice> {
    const invoice: Invoice = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      payments: [],
      remainingBalance: data.total,
    };
    return this.repository.create(invoice);
  }

  async getInvoice(id: string): Promise<Invoice | null> {
    return this.repository.getById(id);
  }

  async updateInvoice(id: string, data: UpdateInvoiceDTO): Promise<Invoice> {
    const updatedInvoice: Invoice = {
      ...(await this.getInvoice(id))!,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return this.repository.update(id, data);
  }

  async deleteInvoice(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async listInvoices(): Promise<Invoice[]> {
    return this.repository.getAll();
  }

  async getInvoicesByStatus(status: Invoice['status']): Promise<Invoice[]> {
    return this.repository.getByStatus(status);
  }

  async addPayment(invoiceId: string, payment: Omit<Payment, 'id'>): Promise<Invoice> {
    const invoice = await this.getInvoice(invoiceId);
    if (!invoice) throw new Error('Invoice not found');

    const newPayment: Payment = {
      ...payment,
      id: crypto.randomUUID(),
    };

    const updatedPayments = [...invoice.payments, newPayment];
    const totalPaid = updatedPayments.reduce((sum, p) => sum + p.amount, 0);
    const remainingBalance = invoice.total - totalPaid;

    const status = remainingBalance <= 0 ? 'paid' : 'partial';

    return this.updateInvoice(invoiceId, {
      payments: updatedPayments,
      remainingBalance,
      status,
    });
  }

  async getPaymentHistory(invoiceId: string): Promise<Payment[]> {
    const invoice = await this.getInvoice(invoiceId);
    return invoice?.payments || [];
  }
}

// Export a singleton instance
export const invoiceService = new InvoiceService(new InvoiceRepositoryImpl()); 