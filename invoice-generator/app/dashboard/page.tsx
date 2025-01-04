'use client';

import { useInvoices } from '@/lib/contexts/invoice-context';
import { InvoiceList } from '@/components/dashboard/invoice-list';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { EmptyState } from '@/components/dashboard/empty-state';

export default function DashboardPage() {
  const { invoices, loading, error } = useInvoices();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        <DashboardHeader />
        <DashboardStats invoices={invoices} />
        {invoices.length > 0 ? (
          <InvoiceList invoices={invoices} />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
