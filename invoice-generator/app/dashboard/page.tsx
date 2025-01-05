'use client';

import { Suspense } from 'react';
import { InvoiceList } from '@/components/dashboard/invoice-list';
import { EmptyState } from '@/components/dashboard/empty-state';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useInvoices } from '@/lib/contexts/invoice-context';

export default function DashboardPage() {
  const { invoices } = useInvoices();

  return (
    <main className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Invoices</h1>
        <Link href="/">
          <Button>Create Invoice</Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        {invoices.length > 0 ? (
          <InvoiceList invoices={invoices} />
        ) : (
          <EmptyState />
        )}
      </Suspense>
    </main>
  );
}
