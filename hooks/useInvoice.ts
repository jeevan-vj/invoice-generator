import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Invoice, CreateInvoiceDTO, UpdateInvoiceDTO } from '@/types/invoice/Invoice';
import { InvoiceService } from '@/services/InvoiceService';
import { LocalStorageInvoiceRepository } from '@/lib/repositories/LocalStorageInvoiceRepository';

const invoiceService = new InvoiceService(new LocalStorageInvoiceRepository());

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoiceService.getInvoice(id),
  });
}

export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: () => invoiceService.getAllInvoices(),
  });
}

export function useInvoicesByStatus(status: Invoice['status']) {
  return useQuery({
    queryKey: ['invoices', status],
    queryFn: () => invoiceService.getInvoicesByStatus(status),
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invoice: CreateInvoiceDTO) => invoiceService.createInvoice(invoice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, invoice }: { id: string; invoice: UpdateInvoiceDTO }) =>
      invoiceService.updateInvoice(id, invoice),
    onSuccess: (data: Invoice) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', data.id] });
    },
  });
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => invoiceService.deleteInvoice(id),
    onSuccess: (_: void, id: string) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', id] });
    },
  });
} 