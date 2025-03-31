export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  price: number
  rate?: number
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

interface Sender {
  firstName: string;
  lastName: string;
  companyName?: string;
  email: string;
  phone?: string;
  address?: Address;
  logo?: string;
}

export interface CompanyDetails extends Sender {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: Address;
  companyName?: string;
  logo?: string;
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

export interface Adjustment {
  description: string;
  amount: number;
}

export interface InvoiceData {
  id?: string;
  sender: CompanyDetails
  client: CompanyDetails
  invoiceNumber: string
  issueDate: string
  dueDate: string
  items: InvoiceItem[]
  memo?: string
  taxRate: number
  pdfUrl?: string
  adjustments: Adjustment[]
  status: 'draft' | 'sent' | 'partial' | 'paid' | 'overdue'
  total: number
  payments: Payment[]
  remainingBalance: number
}

export interface Theme {
  primary: string;
  secondary: string;
}

export interface TemplateProps {
  data: InvoiceData;
  theme: Theme;
}

export interface InvoiceNumberConfig {
  format: string
  prefix: string
  suffix: string
  startNumber: number
  padding: number
  includeYear: boolean
  includeMonth: boolean
  separator: string
}

