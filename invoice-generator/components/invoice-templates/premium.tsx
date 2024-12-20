import { Card, CardContent } from "@/components/ui/card"
import { InvoiceData } from "@/types/invoice"
import { calculateSubtotal, calculateTax, formatCurrency } from "@/utils/calculations"
import { TemplateProps } from "@/types/invoice";

export const PremiumTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const subtotal = calculateSubtotal(data.items)
  const tax = calculateTax(subtotal, data.taxRate)
  const total = subtotal + tax

  return (
    <Card className="bg-white overflow-hidden">
      <div className="h-2" style={{ background: theme.primary }} />
      <CardContent className="p-8">
        <div className="space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-5xl font-light" style={{ color: theme.primary }}>
                Invoice
              </h2>
              <p className="text-sm mt-2 text-muted-foreground">
                #{data.invoiceNumber}
              </p>
            </div>
            <div className="text-right space-y-1">
              <div className="inline-block px-3 py-1 rounded-full text-xs" 
                style={{ background: `${theme.primary}20`, color: theme.primary }}>
                Due: {data.dueDate}
              </div>
              <p className="text-sm text-muted-foreground">
                Issued: {data.issueDate}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 py-8 border-y">
            <div>
              <h3 className="text-xs uppercase tracking-wider mb-4" 
                style={{ color: theme.primary }}>From</h3>
              <div className="space-y-1">
                <p className="text-lg font-medium">
                  {`${data.sender.firstName} ${data.sender.lastName}`}
                </p>
                {data.sender.companyName && (
                  <p>{data.sender.companyName}</p>
                )}
                <p className="text-muted-foreground">{data.sender.email}</p>
              </div>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-wider mb-4"
                style={{ color: theme.primary }}>To</h3>
              <div className="space-y-1">
                <p className="text-lg font-medium">
                  {`${data.client.firstName} ${data.client.lastName}`}
                </p>
                {data.client.companyName && (
                  <p>{data.client.companyName}</p>
                )}
                <p className="text-muted-foreground">{data.client.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left text-xs uppercase tracking-wider"
                    style={{ color: theme.primary }}>Description</th>
                  <th className="py-3 text-right text-xs uppercase tracking-wider"
                    style={{ color: theme.primary }}>Qty</th>
                  <th className="py-3 text-right text-xs uppercase tracking-wider"
                    style={{ color: theme.primary }}>Price</th>
                  <th className="py-3 text-right text-xs uppercase tracking-wider"
                    style={{ color: theme.primary }}>Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4">{item.description}</td>
                    <td className="py-4 text-right">{item.quantity}</td>
                    <td className="py-4 text-right">{formatCurrency(item.price)}</td>
                    <td className="py-4 text-right">
                      {formatCurrency(item.quantity * item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-8 pt-8 border-t">
              <div className="flex justify-end">
                <div className="w-80 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Tax ({data.taxRate}%)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Due</span>
                    <span className="text-2xl font-light" style={{ color: theme.primary }}>
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {data.memo && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-xs uppercase tracking-wider mb-4"
                style={{ color: theme.primary }}>Notes</h3>
              <p className="text-sm text-muted-foreground">{data.memo}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
