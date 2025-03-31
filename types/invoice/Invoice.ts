export interface CompanyDetails {
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}

export interface InvoiceAdjustment {
  id: string;
  type: 'addition' | 'deduction';
  description: string;
  amount: number;
  isPercentage: boolean;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  method: 'cash' | 'bank_transfer' | 'credit_card' | 'other';
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  sender: CompanyDetails;
  client: CompanyDetails;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
  status: 'draft' | 'sent' | 'partial' | 'paid' | 'overdue';
  createdAt: string;
  updatedAt: string;
  payments: Payment[];
  remainingBalance: number;
  adjustments: InvoiceAdjustment[];
  issueDate: string;
}

export type CreateInvoiceDTO = Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateInvoiceDTO = Partial<Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>>; 