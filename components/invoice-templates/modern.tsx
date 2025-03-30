import { Card, CardContent } from "@/components/ui/card"
import { InvoiceData } from "@/types/invoice"
import { calculateSubtotal, calculateTax, formatCurrency } from "@/utils/calculations"
import { TemplateProps } from "@/types/invoice";

export const ModernTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const subtotal = calculateSubtotal(data.items)
  const tax = calculateTax(subtotal, data.taxRate)
  const total = subtotal + tax

  if (!data.sender.firstName && !data.client.firstName && data.items.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-[600px] items-center justify-center p-6">
          <p className="text-sm text-muted-foreground">
            Enter invoice details to preview modern template
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50">
      <CardContent className="p-8">
        <div className="space-y-8" style={{ '--invoice-primary': theme.primary, '--invoice-secondary': theme.secondary } as React.CSSProperties}>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold" style={{ color: theme.primary }}>
              INVOICE
            </h2>
            <div className="text-right">
              <p className="text-2xl font-bold">#{data.invoiceNumber}</p>
              <p className="text-sm text-muted-foreground">
                Issue Date: {data.issueDate}
              </p>
              <p className="text-sm text-muted-foreground">
                Due Date: {data.dueDate}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4 p-6 rounded-lg bg-gray-50/80 border">
              <div>
                <p className="text-sm font-medium text-primary mb-2">From</p>
                <p className="font-bold">{`${data.sender.firstName} ${data.sender.lastName}`}</p>
                {data.sender.companyName && (
                  <p className="text-sm font-medium">{data.sender.companyName}</p>
                )}
                <p className="text-sm text-muted-foreground">{data.sender.email}</p>
              </div>
            </div>
            <div className="space-y-4 p-6 rounded-lg bg-gray-50/80 border">
              <div>
                <p className="text-sm font-medium text-primary mb-2">To</p>
                <p className="font-bold">{`${data.client.firstName} ${data.client.lastName}`}</p>
                {data.client.companyName && (
                  <p className="text-sm font-medium">{data.client.companyName}</p>
                )}
                <p className="text-sm text-muted-foreground">{data.client.email}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Qty</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Price</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-4 py-3">{item.description}</td>
                    <td className="px-4 py-3 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(item.price)}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(item.quantity * item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-72 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({data.taxRate}%)</span>
                <span className="font-medium">{formatCurrency(tax)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>

          {data.memo && (
            <div className="rounded-lg bg-gray-50/80 border p-4">
              <p className="text-sm font-medium mb-2">Notes</p>
              <p className="text-sm text-muted-foreground">{data.memo}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
