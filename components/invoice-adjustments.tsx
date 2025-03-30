import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { InvoiceAdjustment } from '@/types/invoice';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/calculations';

interface InvoiceAdjustmentsProps {
  adjustments: InvoiceAdjustment[];
  subtotal: number;
  onAdjustmentsChange: (adjustments: InvoiceAdjustment[]) => void;
}

export function InvoiceAdjustments({
  adjustments,
  subtotal,
  onAdjustmentsChange,
}: InvoiceAdjustmentsProps) {
  const [isAdding, setIsAdding] = useState(false);

  const addAdjustment = () => {
    const newAdjustment: InvoiceAdjustment = {
      id: crypto.randomUUID(),
      type: 'addition',
      description: '',
      amount: 0,
      isPercentage: false,
    };
    onAdjustmentsChange([...adjustments, newAdjustment]);
    setIsAdding(true);
  };

  const updateAdjustment = (
    id: string,
    field: keyof InvoiceAdjustment,
    value: any
  ) => {
    onAdjustmentsChange(
      adjustments.map((adj) =>
        adj.id === id ? { ...adj, [field]: value } : adj
      )
    );
  };

  const removeAdjustment = (id: string) => {
    onAdjustmentsChange(adjustments.filter((adj) => adj.id !== id));
  };

  const calculateAdjustmentAmount = (adjustment: InvoiceAdjustment): number => {
    if (adjustment.isPercentage) {
      return (subtotal * adjustment.amount) / 100;
    }
    return adjustment.amount;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Additional Charges & Deductions</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addAdjustment}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Adjustment
        </Button>
      </div>

      <div className="space-y-4">
        {adjustments.map((adjustment) => (
          <div
            key={adjustment.id}
            className="grid grid-cols-12 gap-4 items-center"
          >
            <div className="col-span-2">
              <Select
                value={adjustment.type}
                onValueChange={(value: 'addition' | 'deduction') =>
                  updateAdjustment(adjustment.id, 'type', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="addition">Addition</SelectItem>
                  <SelectItem value="deduction">Deduction</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-4">
              <Input
                placeholder="Description"
                value={adjustment.description}
                onChange={(e) =>
                  updateAdjustment(adjustment.id, 'description', e.target.value)
                }
              />
            </div>

            <div className="col-span-3">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={adjustment.amount}
                  onChange={(e) =>
                    updateAdjustment(
                      adjustment.id,
                      'amount',
                      parseFloat(e.target.value) || 0
                    )
                  }
                />
                <div className="flex items-center gap-2">
                  <Switch
                    checked={adjustment.isPercentage}
                    onCheckedChange={(checked) =>
                      updateAdjustment(adjustment.id, 'isPercentage', checked)
                    }
                  />
                  <Label>%</Label>
                </div>
              </div>
            </div>

            <div className="col-span-2 text-right">
              {formatCurrency(calculateAdjustmentAmount(adjustment))}
            </div>

            <div className="col-span-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeAdjustment(adjustment.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
