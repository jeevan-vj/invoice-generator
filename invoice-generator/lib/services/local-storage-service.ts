import { InvoiceData } from '@/types/invoice';
import { ApiResponse, InvoiceService } from '@/types/api';

const STORAGE_KEY = 'invoices';

export class LocalStorageService implements InvoiceService {
  private getStorage(): Record<string, InvoiceData> {
    if (typeof window === 'undefined') return {};
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }

  private setStorage(data: Record<string, InvoiceData>): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  async createInvoice(data: InvoiceData): Promise<ApiResponse<InvoiceData>> {
    try {
      const storage = this.getStorage();
      const id = crypto.randomUUID();
      const invoice = { ...data, id };
      storage[id] = invoice;
      this.setStorage(storage);
      return { data: invoice };
    } catch (error) {
      return { data: data, error: 'Failed to create invoice' };
    }
  }

  async getInvoice(id: string): Promise<ApiResponse<InvoiceData>> {
    try {
      const storage = this.getStorage();
      const invoice = storage[id];
      if (!invoice) {
        return { data: {} as InvoiceData, error: 'Invoice not found' };
      }
      return { data: invoice };
    } catch (error) {
      return { data: {} as InvoiceData, error: 'Failed to get invoice' };
    }
  }

  async updateInvoice(
    id: string,
    data: InvoiceData
  ): Promise<ApiResponse<InvoiceData>> {
    try {
      const storage = this.getStorage();
      if (!storage[id]) {
        return { data: data, error: 'Invoice not found' };
      }
      storage[id] = { ...data, id };
      this.setStorage(storage);
      return { data: storage[id] };
    } catch (error) {
      return { data: data, error: 'Failed to update invoice' };
    }
  }

  async deleteInvoice(id: string): Promise<ApiResponse<void>> {
    try {
      const storage = this.getStorage();
      delete storage[id];
      this.setStorage(storage);
      return { data: undefined };
    } catch (error) {
      return { data: undefined, error: 'Failed to delete invoice' };
    }
  }

  async listInvoices(): Promise<ApiResponse<InvoiceData[]>> {
    try {
      const storage = this.getStorage();
      return { data: Object.values(storage) };
    } catch (error) {
      return { data: [], error: 'Failed to list invoices' };
    }
  }
} 