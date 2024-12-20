"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from 'next/dynamic'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CompanyDetailsForm } from "./company-details-form"
import { InvoiceItems } from "./invoice-items"
import { InvoicePreview } from "./invoice-preview"
import { InvoiceData, CompanyDetails } from "../types/invoice"
import { BanknoteIcon as Bank, CreditCard, ShoppingCartIcon as Paypal } from 'lucide-react'
import jsPDF from 'jspdf'
import { TemplateSelector, TemplateOption } from "./template-selector"
import { ModernTemplate } from "./invoice-templates/modern"
import { MinimalTemplate } from "./invoice-templates/minimal"
// ...other template imports...

//const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink), { ssr: false })
//const InvoicePDF = dynamic(() => import('./components/invoice-pdf'), { ssr: false })

const emptyCompanyDetails: CompanyDetails = {
  firstName: "",
  lastName: "",
  email: "",
}

const initialInvoiceData: InvoiceData = {
  sender: emptyCompanyDetails,
  client: emptyCompanyDetails,
  invoiceNumber: "23-001",
  issueDate: new Date().toISOString().split("T")[0],
  dueDate: "Upon Receipt",
  items: [],
  taxRate: 0,
}

export default function InvoiceGenerator() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(initialInvoiceData)
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateOption>("classic")
  const [isPDFReady, setIsPDFReady] = useState(false)
  const invoiceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsPDFReady(true)
  }, [])

  const generatePDF = () => {
    if (!invoiceRef.current || !invoiceData) return

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfElement = invoiceRef.current
    
    pdf.html(pdfElement, {
      callback: function (pdf) {
        pdf.save(`invoice_${invoiceData.invoiceNumber.replace(/\s+/g, '_')}.pdf`)
      },
      x: 10,
      y: 10,
      width: 190,
      windowWidth: 650
    })
  }

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "modern":
        return <ModernTemplate data={invoiceData} />
      case "minimal":
        return <MinimalTemplate data={invoiceData} />
      default:
        return <InvoicePreview data={invoiceData} />
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-8 space-y-8">
        <TemplateSelector
          selected={selectedTemplate}
          onSelect={setSelectedTemplate}
        />
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="space-y-8">
            <header>
              <h1 className="text-3xl font-semibold">Create your invoice</h1>
              <meta name="description" content="Generate a professional invoice instantly with our free online invoice generator" />
            </header>
            
            <CompanyDetailsForm
              title="Your info"
              data={invoiceData.sender}
              onChange={(sender) => setInvoiceData({ ...invoiceData, sender })}
            />

            <CompanyDetailsForm
              title="Client info"
              data={invoiceData.client}
              onChange={(client) => setInvoiceData({ ...invoiceData, client })}
            />

            <section className="space-y-4" aria-label="Invoice Information">
              <h2 className="text-lg font-medium">Invoice info</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoice-number">Invoice #</Label>
                  <Input
                    id="invoice-number"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) =>
                      setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issue-date">Issued date</Label>
                  <Input
                    id="issue-date"
                    type="date"
                    value={invoiceData.issueDate}
                    onChange={(e) =>
                      setInvoiceData({ ...invoiceData, issueDate: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due date</Label>
                  <Input
                    id="due-date"
                    value={invoiceData.dueDate}
                    onChange={(e) =>
                      setInvoiceData({ ...invoiceData, dueDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </section>

            <section aria-label="Invoice Items">
              <InvoiceItems
                items={invoiceData.items}
                onItemsChange={(items) => setInvoiceData({ ...invoiceData, items })}
              />
            </section>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="memo">Memo</Label>
                <Textarea
                  id="memo"
                  placeholder="Additional notes..."
                  value={invoiceData.memo}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, memo: e.target.value })
                  }
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="tax-rate">Tax %</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    className="w-24"
                    value={invoiceData.taxRate}
                    onChange={(e) =>
                      setInvoiceData({
                        ...invoiceData,
                        taxRate: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </article>
          <aside className="space-y-4">
            <div ref={invoiceRef}>
              {renderTemplate()}
            </div>

            <Button className="w-full bg-primary" size="lg">
              Send invoice for free
            </Button>
            <Button className="w-full bg-secondary" size="lg" onClick={generatePDF}>
              Download PDF
            </Button>
          </aside>
        </div>
      </div>
    </main>
  )
}

