'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export function DashboardHeader() {
  const searchParams = useSearchParams();
  const isEdit = searchParams.has('id');

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEdit ? 'Edit Invoice' : 'Invoices'}
        </h1>
        <p className="text-muted-foreground">
          {isEdit
            ? 'Update your invoice details'
            : 'Manage your invoices and track payments'}
        </p>
      </div>
      {!isEdit && (
        <Link href="/">
          <Button className="bg-primary">
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      )}
    </div>
  );
}
