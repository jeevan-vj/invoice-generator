'use client';

import { InvoiceData } from '@/types/invoice';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/utils/calculations';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Download, Trash2 } from 'lucide-react';
import { useInvoices } from '@/lib/contexts/invoice-context';
import { useRouter } from 'next/navigation';
import { getPDFService } from '@/lib/services/pdf-service';

interface InvoiceListProps {
  invoices: InvoiceData[];
}

export function InvoiceList({ invoices }: InvoiceListProps) {
  const router = useRouter();
  const { deleteInvoice } = useInvoices();

  const handleEdit = (id: string) => {
    router.push(`/?id=${id}`);
  };

  const calculateTotal = (invoice: InvoiceData) => {
    const subtotal = invoice.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const tax = (subtotal * invoice.taxRate) / 100;
    return subtotal + tax;
  };

  const handleDownload = (invoice: InvoiceData) => {
    if (invoice.pdfUrl) {
      const link = document.createElement('a');
      link.href = invoice.pdfUrl;
      link.download = `invoice_${invoice.invoiceNumber.replace(
        /\s+/g,
        '_'
      )}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.error('No PDF available for this invoice');
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Client</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">
                {invoice.invoiceNumber}
              </TableCell>
              <TableCell>{invoice.issueDate}</TableCell>
              <TableCell>
                {invoice.client.firstName} {invoice.client.lastName}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(calculateTotal(invoice))}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => invoice.id && handleEdit(invoice.id)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDownload(invoice)}
                      disabled={!invoice.pdfUrl}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => invoice.id && deleteInvoice(invoice.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
