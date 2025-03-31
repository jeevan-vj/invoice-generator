"use client"

import { useState } from "react";
import { useParams } from "next/navigation";
import { useInvoice } from "@/hooks/useInvoice";
import { useInvoicePayment } from "@/hooks/useInvoicePayment";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { PaymentTracker } from "@/components/PaymentTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoicePreview } from "@/components/invoice-preview";
import { InvoicePDFDownload } from "@/components/invoice-pdf-download";

export default function InvoiceDetail() {
  const { id } = useParams();
  const { data: invoice, isLoading } = useInvoice(id as string);
  const { addPayment } = useInvoicePayment();
  const [activeTab, setActiveTab] = useState("details");

  if (isLoading || !invoice) {
    return <div>Loading...</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "sent":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "partial":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString === "Upon Receipt") return dateString;
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">Invoice #{invoice.invoiceNumber}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {invoice.client.firstName} {invoice.client.lastName}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className={getStatusColor(invoice.status)}>
            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </Badge>
          <InvoicePDFDownload invoice={invoice} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Issue Date</span>
                  <span>{formatDate(invoice.issueDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Due Date</span>
                  <span>{formatDate(invoice.dueDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Amount</span>
                  <span className="font-medium">{formatCurrency(invoice.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Remaining Balance</span>
                  <span className="font-medium">{formatCurrency(invoice.remainingBalance)}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">Client Details</h2>
              <div className="space-y-1">
                <p>{invoice.client.firstName} {invoice.client.lastName}</p>
                {invoice.client.companyName && <p>{invoice.client.companyName}</p>}
                <p>{invoice.client.email}</p>
                {invoice.client.phone && <p>{invoice.client.phone}</p>}
                {invoice.client.address && (
                  <div>
                    <p>{invoice.client.address.street}</p>
                    <p>
                      {invoice.client.address.city}, {invoice.client.address.state} {invoice.client.address.zipCode}
                    </p>
                    <p>{invoice.client.address.country}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <InvoicePreview 
            data={invoice} 
            theme={{ primary: "#000000", secondary: "#666666" }} 
          />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentTracker
            invoice={invoice}
            onAddPayment={async (payment) => {
              await addPayment.mutateAsync({
                invoiceId: invoice.id!,
                payment,
              });
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 