export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  price: number
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
  adjustments: InvoiceAdjustment[]
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  total: number
}

export interface Theme {
  primary: string;
  secondary: string;
}

export interface TemplateProps {
  data: InvoiceData;
  theme: Theme;
}

