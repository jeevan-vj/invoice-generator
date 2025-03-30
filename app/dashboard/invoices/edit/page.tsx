"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useInvoices } from "@/lib/contexts/invoice-context"
import InvoiceGenerator from "@/components/invoice-generator"
import { InvoiceData } from "@/types/invoice"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EditInvoicePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { invoices } = useInvoices()
  const invoiceId = searchParams.get("id")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const invoice = invoices.find((inv) => inv.id === invoiceId)

  useEffect(() => {
    // If we have the invoice in our list, we're done loading
    if (invoice) {
      setIsLoading(false)
    }
  }, [invoice])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Invoice
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/invoices")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Invoices
          </Button>
        </div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Invoice Not Found
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            The invoice you're looking for doesn't exist or has been deleted.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/invoices")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Invoices
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Edit Invoice
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Make changes to your invoice below.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/invoices")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </Button>
      </div>
      <InvoiceGenerator />
    </div>
  )
} 