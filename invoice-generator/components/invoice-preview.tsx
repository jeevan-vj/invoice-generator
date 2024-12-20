import { Card, CardContent } from "@/components/ui/card"
import { InvoiceData } from "../types/invoice"
import { calculateSubtotal, calculateTax, formatCurrency } from "../utils/calculations"

export function InvoicePreview({ data }: { data: InvoiceData }) {
  const subtotal = calculateSubtotal(data.items)
  const tax = calculateTax(subtotal, data.taxRate)
  const total = subtotal + tax

  if (!data.sender.firstName && !data.client.firstName && data.items.length === 0) {
    return (
      <Card>
        <CardContent className="flex h-[600px] items-center justify-center p-6">
          <p className="text-sm text-muted-foreground">
            Enter invoice details to start seeing a preview
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Invoice #{data.invoiceNumber}</h2>
            <div className="text-sm text-muted-foreground">
              <p>Issue Date: {data.issueDate}</p>
              <p>Due Date: {data.dueDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">From</p>
              <p className="font-medium">{`${data.sender.firstName} ${data.sender.lastName}`}</p>
              {data.sender.companyName && (
                <p className="text-sm">{data.sender.companyName}</p>
              )}
              <p className="text-sm">{data.sender.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">To</p>
              <p className="font-medium">{`${data.client.firstName} ${data.client.lastName}`}</p>
              {data.client.companyName && (
                <p className="text-sm">{data.client.companyName}</p>
              )}
              <p className="text-sm">{data.client.email}</p>
            </div>
          </div>

          <div className="rounded-lg border">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-right">Qty</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="p-3">{item.description}</td>
                    <td className="p-3 text-right">{item.quantity}</td>
                    <td className="p-3 text-right">{formatCurrency(item.price)}</td>
                    <td className="p-3 text-right">
                      {formatCurrency(item.quantity * item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax ({data.taxRate}%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {data.memo && (
            <div className="space-y-2 rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">Notes</p>
              <p className="text-sm">{data.memo}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

