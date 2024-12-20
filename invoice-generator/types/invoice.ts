export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  price: number
}

export interface CompanyDetails {
  firstName: string
  lastName: string
  email: string
  companyName?: string
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

