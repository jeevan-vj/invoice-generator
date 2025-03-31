"use client"

import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoiceData } from "@/types/invoice";
import { InvoicePDF } from "./invoice-pdf";

interface InvoicePDFDownloadProps {
  invoice: InvoiceData;
}

export function InvoicePDFDownload({ invoice }: InvoicePDFDownloadProps) {
  return (
    <PDFDownloadLink
      document={<InvoicePDF data={invoice} />}
      fileName={`invoice-${invoice.invoiceNumber}.pdf`}
    >
      {({ loading }) => (
        <Button variant="outline" disabled={loading}>
          {loading ? "Generating PDF..." : "Download PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
} 