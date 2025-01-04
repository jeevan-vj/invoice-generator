import { Card, CardContent } from '@/components/ui/card';
import { InvoiceData, TemplateProps } from '@/types/invoice';
import {
  calculateSubtotal,
  calculateTax,
  formatCurrency,
} from '@/utils/calculations';
import Image from 'next/image';

export const InvoicePreview: React.FC<TemplateProps> = ({ data, theme }) => {
  const subtotal = calculateSubtotal(data.items);
  const tax = calculateTax(subtotal, data.taxRate);
  const total = subtotal + tax;

  if (
    !data.sender.firstName &&
    !data.client.firstName &&
    data.items.length === 0
  ) {
    return (
      <Card>
        <CardContent className="flex h-[600px] items-center justify-center p-6">
          <p className="text-sm text-muted-foreground">
            Enter invoice details to start seeing a preview
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6" data-invoice-template>
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2
                className="text-2xl font-bold"
                style={{ color: theme.primary }}
              >
                INVOICE
              </h2>
              <p className="text-sm text-muted-foreground">
                #{data.invoiceNumber}
              </p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="text-right">
                <p className="text-sm">Issue Date: {data.issueDate}</p>
                <p className="text-sm">Due Date: {data.dueDate}</p>
              </div>
              {data.sender.logo && (
                <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-muted">
                  <Image
                    src={data.sender.logo}
                    alt="Company logo"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p
                className="text-sm font-medium mb-2"
                style={{ color: theme.primary }}
              >
                From
              </p>
              <p className="font-medium">{`${data.sender.firstName} ${data.sender.lastName}`}</p>
              {data.sender.companyName && (
                <p className="text-sm">{data.sender.companyName}</p>
              )}
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{data.sender.email}</p>
                {data.sender.phone && <p>{data.sender.phone}</p>}
                {data.sender.address && (
                  <div className="mt-1">
                    <p>{data.sender.address.street}</p>
                    <p>{`${data.sender.address.city}, ${data.sender.address.state} ${data.sender.address.zipCode}`}</p>
                    <p>{data.sender.address.country}</p>
                  </div>
                )}
              </div>
            </div>
            <div>
              <p
                className="text-sm font-medium mb-2"
                style={{ color: theme.primary }}
              >
                To
              </p>
              <p className="font-medium">{`${data.client.firstName} ${data.client.lastName}`}</p>
              {data.client.companyName && (
                <p className="text-sm">{data.client.companyName}</p>
              )}
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{data.client.email}</p>
                {data.client.phone && <p>{data.client.phone}</p>}
                {data.client.address && (
                  <div className="mt-1">
                    <p>{data.client.address.street}</p>
                    <p>{`${data.client.address.city}, ${data.client.address.state} ${data.client.address.zipCode}`}</p>
                    <p>{data.client.address.country}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2 text-left text-sm font-medium">
                    Description
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium">
                    Qty
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium">
                    Price
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-4 py-2">{item.description}</td>
                    <td className="px-4 py-2 text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-right">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      {formatCurrency(item.quantity * item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-60 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tax ({data.taxRate}%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span style={{ color: theme.primary }}>
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {data.memo && (
            <div className="border-t pt-4">
              <p
                className="text-sm font-medium mb-2"
                style={{ color: theme.primary }}
              >
                Notes
              </p>
              <p className="text-sm text-muted-foreground">{data.memo}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
