"use client"

import { useState } from "react"
import { MoreHorizontal, FileText, Download, Send, Edit, Trash2, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useInvoices } from "@/lib/contexts/invoice-context"
import { InvoiceData } from "@/types/invoice"
import { calculateSubtotal, calculateTax, calculateAdjustments } from "@/utils/calculations"

interface InvoiceListProps {
  viewMode: "list" | "grid"
  status?: InvoiceData["status"]
}

export default function InvoiceList({ viewMode, status }: InvoiceListProps) {
  const router = useRouter()
  const { invoices, deleteInvoice, saveInvoice } = useInvoices()
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])

  const filteredInvoices = status ? invoices.filter(inv => inv.status === status) : invoices

  const getStatusColor = (status: InvoiceData["status"] | undefined) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "sent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatStatus = (status: InvoiceData["status"] | undefined) => {
    if (!status) return "Draft"
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const calculateTotal = (invoice: InvoiceData) => {
    const subtotal = calculateSubtotal(invoice.items)
    const tax = calculateTax(subtotal, invoice.taxRate)
    const adjustments = calculateAdjustments(subtotal, invoice.adjustments)
    return subtotal + tax + adjustments
  }

  const formatDate = (dateString: string) => {
    if (dateString === "Upon Receipt") return dateString
    try {
      return format(new Date(dateString), "MMM d, yyyy")
    } catch (error) {
      return dateString
    }
  }

  const handleEdit = (invoiceId: string) => {
    router.push(`/dashboard/invoices/${invoiceId}`);
  }

  const handleDelete = async (invoiceId: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      await deleteInvoice(invoiceId)
    }
  }

  const handleTogglePaid = async (invoice: InvoiceData) => {
    const newStatus = invoice.status === "paid" ? "sent" : "paid"
    await saveInvoice({ ...invoice, status: newStatus })
  }

  const PaidStatusToggle = ({ invoice }: { invoice: InvoiceData }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Switch
              checked={invoice.status === "paid"}
              onCheckedChange={() => handleTogglePaid(invoice)}
              className="data-[state=checked]:bg-green-600"
            />
            <Badge className={getStatusColor(invoice.status)}>
              {formatStatus(invoice.status)}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to mark as {invoice.status === "paid" ? "unpaid" : "paid"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInvoices.map((invoice) => (
          <div
            key={invoice.id}
            className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{invoice.invoiceNumber}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{invoice.client.firstName} {invoice.client.lastName}</p>
              </div>
              <PaidStatusToggle invoice={invoice} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Date</span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(invoice.issueDate)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Due Date</span>
                <span className="text-gray-900 dark:text-white">
                  {formatDate(invoice.dueDate)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Amount</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(calculateTotal(invoice))}
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEdit(invoice.id!)}>
                    <Edit className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Send className="mr-2 h-4 w-4" />
                    Send
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-600"
                    onClick={() => handleDelete(invoice.id!)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-[#1F1F23]">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Invoice
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-[#1F1F23]">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-[#1A1A1E]">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {invoice.invoiceNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {invoice.client.firstName} {invoice.client.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {formatDate(invoice.issueDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {formatDate(invoice.dueDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(calculateTotal(invoice))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PaidStatusToggle invoice={invoice} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(invoice.id!)}>
                        <Edit className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="mr-2 h-4 w-4" />
                        Send
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDelete(invoice.id!)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 