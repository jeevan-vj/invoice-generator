import { Invoice, CreateInvoiceDTO, UpdateInvoiceDTO } from './Invoice';

export interface InvoiceRepository {
  create(invoice: CreateInvoiceDTO): Promise<Invoice>;
  getById(id: string): Promise<Invoice | null>;
  getAll(): Promise<Invoice[]>;
  update(id: string, invoice: UpdateInvoiceDTO): Promise<Invoice>;
  delete(id: string): Promise<void>;
  getByStatus(status: Invoice['status']): Promise<Invoice[]>;
} 