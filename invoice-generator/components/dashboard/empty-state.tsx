import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function EmptyState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <FileText className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-xl font-semibold">No invoices created</h2>
        <p className="mb-8 mt-2 text-center text-sm text-muted-foreground">
          You haven't created any invoices yet. Start creating your first
          invoice.
        </p>
        <Link href="/">
          <Button size="lg" className="bg-primary">
            Create Invoice
          </Button>
        </Link>
      </div>
    </div>
  );
}
