import { InvoiceItem } from "../types/invoice"

export const calculateSubtotal = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + item.quantity * item.price, 0)
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

