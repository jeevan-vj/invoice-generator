import { createClient } from '@supabase/supabase-js';
import { InvoiceData } from '@/types/invoice';
import { ApiResponse, InvoiceService } from '@/types/api';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export class SupabaseService implements InvoiceService {
  async createInvoice(data: InvoiceData): Promise<ApiResponse<InvoiceData>> {
    try {
      const { data: invoice, error } = await supabase
        .from('invoices')
        .insert([{ ...data }])
        .select()
        .single();

      if (error) throw error;
      return { data: invoice };
    } catch (error) {
      return { 
        data: data, 
        error: error instanceof Error ? error.message : 'Failed to create invoice' 
      };
    }
  }

  async getInvoice(id: string): Promise<ApiResponse<InvoiceData>> {
    try {
      const { data: invoice, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data: invoice };
    } catch (error) {
      return { 
        data: {} as InvoiceData, 
        error: error instanceof Error ? error.message : 'Failed to get invoice' 
      };
    }
  }

  async updateInvoice(
    id: string,
    data: InvoiceData
  ): Promise<ApiResponse<InvoiceData>> {
    try {
      const { data: invoice, error } = await supabase
        .from('invoices')
        .update({ ...data })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: invoice };
    } catch (error) {
      return { 
        data: data, 
        error: error instanceof Error ? error.message : 'Failed to update invoice' 
      };
    }
  }

  async deleteInvoice(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { data: undefined };
    } catch (error) {
      return { 
        data: undefined, 
        error: error instanceof Error ? error.message : 'Failed to delete invoice' 
      };
    }
  }

  async listInvoices(): Promise<ApiResponse<InvoiceData[]>> {
    try {
      const { data: invoices, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data: invoices };
    } catch (error) {
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Failed to list invoices' 
      };
    }
  }
} 