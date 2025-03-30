import { Card, CardContent } from "@/components/ui/card"
import { InvoiceData } from "@/types/invoice"
import { calculateSubtotal, calculateTax, formatCurrency } from "@/utils/calculations"
import { TemplateProps } from "@/types/invoice";

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, theme }) => {
  const subtotal = calculateSubtotal(data.items)
  const tax = calculateTax(subtotal, data.taxRate)
  const total = subtotal + tax

  return (
    <Card className="bg-white">
      <div className="grid grid-cols-12">
        <div 
          className="col-span-3 p-8 text-white min-h-[800px]"
          style={{ backgroundColor: theme.primary }}
        >
          <div className="space-y-6">
            <h2 className="text-2xl font-light tracking-wider">INVOICE</h2>
            <div className="space-y-2 pt-6">
              <p className="text-sm opacity-80">Invoice Number</p>
              <p className="text-xl font-light">#{data.invoiceNumber}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm opacity-80">Issue Date</p>
              <p className="font-light">{data.issueDate}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm opacity-80">Due Date</p>
              <p className="font-light">{data.dueDate}</p>
            </div>
            <div className="pt-6 space-y-2">
              <p className="text-sm opacity-80">Total Amount</p>
              <p className="text-3xl font-light">{formatCurrency(total)}</p>
            </div>
          </div>
        </div>

        <div className="col-span-9 p-8 space-y-8">
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-wider text-gray-500">From</p>
              <div className="space-y-1">
                <p className="text-xl" style={{ color: theme.primary }}>
                  {`${data.sender.firstName} ${data.sender.lastName}`}
                </p>
                {data.sender.companyName && (
                  <p className="text-gray-600">{data.sender.companyName}</p>
                )}
                <p className="text-gray-500">{data.sender.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-wider text-gray-500">To</p>
              <div className="space-y-1">
                <p className="text-xl" style={{ color: theme.primary }}>
                  {`${data.client.firstName} ${data.client.lastName}`}
                </p>
                {data.client.companyName && (
                  <p className="text-gray-600">{data.client.companyName}</p>
                )}
                <p className="text-gray-500">{data.client.email}</p>
              </div>
            </div>
          </div>

          <table className="w-full mt-8">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 text-left text-sm font-medium text-gray-500">Service</th>
                <th className="py-3 text-right text-sm font-medium text-gray-500">Qty</th>
                <th className="py-3 text-right text-sm font-medium text-gray-500">Rate</th>
                <th className="py-3 text-right text-sm font-medium text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-4">{item.description}</td>
                  <td className="py-4 text-right">{item.quantity}</td>
                  <td className="py-4 text-right">{formatCurrency(item.price)}</td>
                  <td className="py-4 text-right font-medium">
                    {formatCurrency(item.quantity * item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end pt-6">
            <div className="w-72">
              <div className="space-y-3 border-b pb-3">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tax ({data.taxRate}%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-gray-500">Total</span>
                <span className="text-xl font-light" style={{ color: theme.primary }}>
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>

          {data.memo && (
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-3">
                Notes
              </p>
              <p className="text-gray-600">{data.memo}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
