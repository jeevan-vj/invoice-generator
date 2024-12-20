import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Trash2 } from 'lucide-react'
import { InvoiceItem } from "../types/invoice"
import { formatCurrency } from "../utils/calculations"

interface InvoiceItemsProps {
  items: InvoiceItem[]
  onItemsChange: (items: InvoiceItem[]) => void
}

export function InvoiceItems({ items, onItemsChange }: InvoiceItemsProps) {
  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [field]: field === "description" ? value : Number(value) || 0,
        }
      }
      return item
    })
    onItemsChange(newItems)
  }

  const handleAddItem = () => {
    onItemsChange([
      ...items,
      { id: crypto.randomUUID(), description: "", quantity: 1, price: 0 },
    ])
  }

  const handleRemoveItem = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">Items to bill</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">ITEMS</TableHead>
            <TableHead>QTY</TableHead>
            <TableHead>PRICE</TableHead>
            <TableHead>TOTAL</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Input
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                  placeholder="Item description"
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)}
                  min={1}
                />
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={item.price}
                  onChange={(e) => handleItemChange(item.id, "price", e.target.value)}
                  min={0}
                  step={0.01}
                />
              </TableCell>
              <TableCell>{formatCurrency(item.quantity * item.price)}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="outline" onClick={handleAddItem}>
        + New Item
      </Button>
    </div>
  )
}

