import { InvoiceItem, InvoiceAdjustment, InvoiceData, Adjustment } from "../types/invoice"

export const calculateSubtotal = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
}

export const calculateTax = (subtotal: number, taxRate: number): number => {
  return subtotal * (taxRate / 100)
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export const calculateAdjustments = (
  subtotal: number,
  adjustments: InvoiceAdjustment[]
): number => {
  return adjustments.reduce((total, adj) => {
    const amount = adj.isPercentage ? (subtotal * adj.amount) / 100 : adj.amount;
    return adj.type === 'addition' ? total + amount : total - amount;
  }, 0);
};

export const calculateTotal = (subtotal: number, taxRate: number, adjustments: Adjustment[]): number => {
  const taxAmount = (subtotal * taxRate) / 100;
  const adjustmentsTotal = adjustments.reduce((sum, adj) => sum + adj.amount, 0);
  return subtotal + taxAmount + adjustmentsTotal;
};

