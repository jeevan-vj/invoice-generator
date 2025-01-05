import { Suspense } from 'react';
import Loading from './loading';
import InvoiceGenerator from '@/components/invoice-generator';

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <InvoiceGenerator />
    </Suspense>
  );
}
