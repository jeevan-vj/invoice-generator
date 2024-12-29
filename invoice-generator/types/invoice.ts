export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  price: number
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
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
}

export interface Theme {
  primary: string;
  secondary: string;
}

export interface TemplateProps {
  data: InvoiceData;
  theme: Theme;
}

