import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Payment } from '@/types/invoice/Invoice';
import { invoiceService } from '@/services/invoiceService';

export function useInvoicePayment() {
  const queryClient = useQueryClient();

  const addPayment = useMutation({
    mutationFn: ({ invoiceId, payment }: { invoiceId: string; payment: Omit<Payment, 'id'> }) =>
      invoiceService.addPayment(invoiceId, payment),
    onSuccess: (_, { invoiceId }) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['invoice', invoiceId] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });

  return {
    addPayment,
  };
} 