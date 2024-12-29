'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { InvoiceData } from '@/types/invoice';
import { getInvoiceService } from '@/lib/services/invoice-service';

interface InvoiceContextType {
  invoices: InvoiceData[];
  currentInvoice: InvoiceData | null;
  loading: boolean;
  error: string | null;
  loadInvoices: () => Promise<void>;
  saveInvoice: (data: InvoiceData) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  setCurrentInvoice: (invoice: InvoiceData | null) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const service = getInvoiceService();

  const loadInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await service.listInvoices();
      if (response.error) {
        throw new Error(response.error);
      }
      setInvoices(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const saveInvoice = async (data: InvoiceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = data.id
        ? await service.updateInvoice(data.id, data)
        : await service.createInvoice(data);

      if (response.error) {
        throw new Error(response.error);
      }
      await loadInvoices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save invoice');
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await service.deleteInvoice(id);
      if (response.error) {
        throw new Error(response.error);
      }
      await loadInvoices();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete invoice');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        currentInvoice,
        loading,
        error,
        loadInvoices,
        saveInvoice,
        deleteInvoice,
        setCurrentInvoice,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export function useInvoices() {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
}
