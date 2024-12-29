import { InvoiceService } from '@/types/api';
import { LocalStorageService } from './local-storage-service';

let service: InvoiceService | null = null;

export function getInvoiceService(): InvoiceService {
  if (typeof window === 'undefined') {
    // Return a dummy service for SSR
    return {
      createInvoice: async () => ({ data: {} as InvoiceData }),
      getInvoice: async () => ({ data: {} as InvoiceData }),
      updateInvoice: async () => ({ data: {} as InvoiceData }),
      deleteInvoice: async () => ({ data: undefined }),
      listInvoices: async () => ({ data: [] }),
    } as InvoiceService;
  }

  if (!service) {
    service = new LocalStorageService();
  }
  return service;
} 