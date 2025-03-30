import { InvoiceData } from './invoice';

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface InvoiceService {
  createInvoice(data: InvoiceData): Promise<ApiResponse<InvoiceData>>;
  getInvoice(id: string): Promise<ApiResponse<InvoiceData>>;
  updateInvoice(id: string, data: InvoiceData): Promise<ApiResponse<InvoiceData>>;
  deleteInvoice(id: string): Promise<ApiResponse<void>>;
  listInvoices(): Promise<ApiResponse<InvoiceData[]>>;
} 