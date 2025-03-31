import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from '@/utils/format';
import { calculateSubtotal, calculateTotal } from '@/utils/calculations';

interface ProfessionalTemplateProps {
  data: InvoiceData;
  theme: {
    primary: string;
    secondary: string;
  };
}

export function ProfessionalTemplate({ data, theme }: ProfessionalTemplateProps) {
  const subtotal = calculateSubtotal(data.items);
  const total = calculateTotal(subtotal, data.taxRate, data.adjustments);

  return (
    <div className="min-h-screen bg-white p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="flex justify-between items-start mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold" style={{ color: theme.primary }}>
              INVOICE
            </h1>
            <div className="text-sm text-gray-600">
              <p>Invoice #{data.invoiceNumber}</p>
              <p>Date: {new Date(data.issueDate).toLocaleDateString()}</p>
              <p>Due Date: {data.dueDate}</p>
            </div>
          </div>
          {data.sender.logo && (
            <img
              src={data.sender.logo}
              alt="Company Logo"
              className="h-16 w-auto object-contain"
            />
          )}
        </header>

        {/* Company Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">From</h2>
            <div className="text-sm">
              <p className="font-medium">{data.sender.firstName} {data.sender.lastName}</p>
              {data.sender.companyName && <p>{data.sender.companyName}</p>}
              <p>{data.sender.address?.street}</p>
              <p>
                {data.sender.address?.city}, {data.sender.address?.state} {data.sender.address?.zipCode}
              </p>
              <p>{data.sender.address?.country}</p>
              <p>{data.sender.email}</p>
              {data.sender.phone && <p>{data.sender.phone}</p>}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Bill To</h2>
            <div className="text-sm">
              <p className="font-medium">{data.client.firstName} {data.client.lastName}</p>
              {data.client.companyName && <p>{data.client.companyName}</p>}
              <p>{data.client.address?.street}</p>
              <p>
                {data.client.address?.city}, {data.client.address?.state} {data.client.address?.zipCode}
              </p>
              <p>{data.client.address?.country}</p>
              <p>{data.client.email}</p>
              {data.client.phone && <p>{data.client.phone}</p>}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2" style={{ borderColor: theme.primary }}>
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-right py-3 px-4">Quantity</th>
                <th className="text-right py-3 px-4">Rate</th>
                <th className="text-right py-3 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4">{item.description}</td>
                  <td className="py-3 px-4 text-right">{item.quantity}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(item.price)}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(item.quantity * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {data.adjustments.map((adjustment, index) => (
              <div key={index} className="flex justify-between py-2">
                <span>{adjustment.description}</span>
                <span>{formatCurrency(adjustment.amount)}</span>
              </div>
            ))}
            {data.taxRate > 0 && (
              <div className="flex justify-between py-2">
                <span>Tax ({data.taxRate}%)</span>
                <span>{formatCurrency((subtotal * data.taxRate) / 100)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 font-bold border-t-2" style={{ borderColor: theme.primary }}>
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Memo */}
        {data.memo && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{data.memo}</p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t text-sm text-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Payment Terms</h4>
              <p>Net {data.dueDate === 'Upon Receipt' ? '0' : '30'} days</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Payment Methods</h4>
              <p>Bank Transfer</p>
              <p>Credit Card</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Thank You</h4>
              <p>Thank you for your business!</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
} 