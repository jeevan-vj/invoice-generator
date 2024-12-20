import { Card, CardContent } from "@/components/ui/card"
import { InvoiceData } from "@/types/invoice"
import { calculateSubtotal, calculateTax, formatCurrency } from "@/utils/calculations"

export function BrandedTemplate({ data, theme }: { data: InvoiceData, theme: { primary: string, secondary: string } }) {
  const subtotal = calculateSubtotal(data.items)
  const tax = calculateTax(subtotal, data.taxRate)
  const total = subtotal + tax

  return (
    <Card className="bg-white">
      <div className="grid grid-cols-5">
        <div className="col-span-1 p-8" style={{ background: theme.primary }}>
          <div className="sticky top-8 space-y-6 text-white">
            <h2 className="text-2xl font-bold">INVOICE</h2>
            <div>
              <p className="text-xs opacity-70">Invoice Number</p>
              <p className="font-medium">#{data.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Issue Date</p>
              <p className="font-medium">{data.issueDate}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Due Date</p>
              <p className="font-medium">{data.dueDate}</p>
            </div>
            <div className="pt-6">
              <div className="h-px bg-white/20" />
            </div>
            <div>
              <p className="text-xs opacity-70">Total Amount</p>
              <p className="text-2xl font-bold">{formatCurrency(total)}</p>
            </div>
          </div>
        </div>

        <div className="col-span-4 p-8 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium" style={{ color: theme.primary }}>From</h3>
              <div>
                <p className="font-medium text-xl">
                  {`${data.sender.firstName} ${data.sender.lastName}`}
                </p>
                {data.sender.companyName && (
                  <p className="text-muted-foreground">{data.sender.companyName}</p>
                )}
                <p className="text-muted-foreground">{data.sender.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium" style={{ color: theme.primary }}>To</h3>
              <div>
                <p className="font-medium text-xl">
                  {`${data.client.firstName} ${data.client.lastName}`}
                </p>
                {data.client.companyName && (
                  <p className="text-muted-foreground">{data.client.companyName}</p>
                )}
                <p className="text-muted-foreground">{data.client.email}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border">
            <table className="w-full">
              <thead>
                <tr style={{ background: `${theme.primary}10` }}>
                  <th className="text-left p-4 text-sm font-medium" 
                    style={{ color: theme.primary }}>Item Description</th>
                  <th className="text-right p-4 text-sm font-medium" 
                    style={{ color: theme.primary }}>Quantity</th>
                  <th className="text-right p-4 text-sm font-medium" 
                    style={{ color: theme.primary }}>Price</th>
                  <th className="text-right p-4 text-sm font-medium" 
                    style={{ color: theme.primary }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, i) => (
                  <tr key={item.id} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="p-4">{item.description}</td>
                    <td className="p-4 text-right">{item.quantity}</td>
                    <td className="p-4 text-right">{formatCurrency(item.price)}</td>
                    <td className="p-4 text-right font-medium">
                      {formatCurrency(item.quantity * item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.memo && (
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="text-sm font-medium mb-2" style={{ color: theme.primary }}>
                Notes
              </h3>
              <p className="text-sm text-muted-foreground">{data.memo}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
