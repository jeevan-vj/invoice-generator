export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  price: number
}

export interface CompanyDetails extends Sender {
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
  logo?: string;
}

export interface InvoiceData {
  sender: CompanyDetails
  client: CompanyDetails
  invoiceNumber: string
  issueDate: string
  dueDate: string
  items: InvoiceItem[]
  memo?: string
  taxRate: number
}

export interface Theme {
  primary: string;
  secondary: string;
}

export interface TemplateProps {
  data: InvoiceData;
  theme: Theme;
}

interface Sender {
  firstName: string
  lastName: string
  companyName?: string
  email: string
  logo?: string // Base64 or URL string
}

