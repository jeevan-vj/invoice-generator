import { InvoiceService } from '@/types/api';
import { InvoiceData } from '@/types/invoice';
import { LocalStorageService } from './local-storage-service';
import { SupabaseService } from './supabase-service';

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
    // Use Supabase service instead of LocalStorage
      // service = new SupabaseService();
      service = new LocalStorageService();
  }
  return service;
} 