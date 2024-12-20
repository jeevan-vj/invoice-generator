import { Card, CardContent } from "@/components/ui/card"
import { InvoiceData, TemplateProps } from "@/types/invoice"
import { calculateSubtotal, calculateTax, formatCurrency } from "@/utils/calculations"
import { Separator } from "@/components/ui/separator"

export const MinimalTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const subtotal = calculateSubtotal(data.items)
  const tax = calculateTax(subtotal, data.taxRate)
  const total = subtotal + tax

  if (!data.sender.firstName && !data.client.firstName && data.items.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-[600px] items-center justify-center p-6">
          <p className="text-sm text-muted-foreground">
            Enter invoice details to preview minimal template
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-4xl font-light text-gray-700">Invoice</h2>
            <p className="text-sm text-muted-foreground mt-1">#{data.invoiceNumber}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-16">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">From</p>
              <p className="font-medium">{`${data.sender.firstName} ${data.sender.lastName}`}</p>
              {data.sender.companyName && (
                <p className="text-sm">{data.sender.companyName}</p>
              )}
              <p className="text-sm text-muted-foreground">{data.sender.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">To</p>
              <p className="font-medium">{`${data.client.firstName} ${data.client.lastName}`}</p>
              {data.client.companyName && (
                <p className="text-sm">{data.client.companyName}</p>
              )}
              <p className="text-sm text-muted-foreground">{data.client.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-16 text-sm">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Issue Date</p>
              <p>{data.issueDate}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Due Date</p>
              <p>{data.dueDate}</p>
            </div>
          </div>

          <Separator />

          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground">
                <th className="pb-3 text-left font-normal">Description</th>
                <th className="pb-3 text-right font-normal">Qty</th>
                <th className="pb-3 text-right font-normal">Price</th>
                <th className="pb-3 text-right font-normal">Total</th>
              </tr>
            </thead>
            <tbody className="border-y">
              {data.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3">{item.description}</td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">{formatCurrency(item.price)}</td>
                  <td className="py-3 text-right">
                    {formatCurrency(item.quantity * item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-60 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({data.taxRate}%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-medium">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {data.memo && (
            <div className="space-y-2 text-sm">
              <p className="uppercase tracking-wide text-xs text-muted-foreground">Notes</p>
              <p className="text-muted-foreground">{data.memo}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
