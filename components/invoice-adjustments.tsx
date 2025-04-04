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
import { Adjustment } from '@/types/invoice';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/utils/calculations';

interface InvoiceAdjustmentsProps {
  adjustments: Adjustment[];
  subtotal: number;
  onAdjustmentsChange: (adjustments: Adjustment[]) => void;
}

export function InvoiceAdjustments({
  adjustments,
  subtotal,
  onAdjustmentsChange,
}: InvoiceAdjustmentsProps) {
  const [isAdding, setIsAdding] = useState(false);

  const addAdjustment = () => {
    const newAdjustment: Adjustment = {
      type: 'fee',
      description: '',
      value: 0,
      amount: 0,
      isPercentage: false,
    };
    onAdjustmentsChange([...adjustments, newAdjustment]);
    setIsAdding(true);
  };

  const updateAdjustment = (
    index: number,
    field: keyof Adjustment,
    value: any
  ) => {
    const updatedAdjustments = adjustments.map((adj, i) =>
      i === index ? { ...adj, [field]: value } : adj
    );
    onAdjustmentsChange(updatedAdjustments);
  };

  const removeAdjustment = (index: number) => {
    onAdjustmentsChange(adjustments.filter((_, i) => i !== index));
  };

  const calculateAdjustmentAmount = (adjustment: Adjustment): number => {
    if (adjustment.isPercentage) {
      return (subtotal * adjustment.value) / 100;
    }
    return adjustment.value;
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
        {adjustments.map((adjustment, index) => (
          <div
            key={index}
            className="grid grid-cols-12 gap-4 items-center"
          >
            <div className="col-span-2">
              <Select
                value={adjustment.type}
                onValueChange={(value: 'discount' | 'tax' | 'shipping' | 'fee' | 'other') =>
                  updateAdjustment(index, 'type', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discount">Discount</SelectItem>
                  <SelectItem value="tax">Tax</SelectItem>
                  <SelectItem value="shipping">Shipping</SelectItem>
                  <SelectItem value="fee">Fee</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-4">
              <Input
                placeholder="Description"
                value={adjustment.description}
                onChange={(e) =>
                  updateAdjustment(index, 'description', e.target.value)
                }
              />
            </div>

            <div className="col-span-3">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={adjustment.value}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value) || 0;
                    updateAdjustment(index, 'value', value);
                    updateAdjustment(index, 'amount', value);
                  }}
                />
                <div className="flex items-center gap-2">
                  <Switch
                    checked={adjustment.isPercentage}
                    onCheckedChange={(checked) =>
                      updateAdjustment(index, 'isPercentage', checked)
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
                onClick={() => removeAdjustment(index)}
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
