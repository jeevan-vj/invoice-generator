import React, { useState } from 'react';
import { Payment, InvoiceData } from '../types/invoice';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { formatCurrency } from '../lib/utils';

interface PaymentTrackerProps {
  invoice: InvoiceData;
  onAddPayment: (payment: Omit<Payment, 'id'>) => Promise<void>;
}

export function PaymentTracker({ invoice, onAddPayment }: PaymentTrackerProps) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<Payment['method']>('cash');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const paymentAmount = parseFloat(amount);
    
    if (paymentAmount <= 0 || paymentAmount > invoice.remainingBalance) {
      return;
    }

    await onAddPayment({
      amount: paymentAmount,
      date: new Date().toISOString(),
      method,
      notes,
    });

    // Reset form
    setAmount('');
    setMethod('cash');
    setNotes('');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Payment Tracking</h3>
        <div className="text-sm text-gray-500">
          Remaining Balance: {formatCurrency(invoice.remainingBalance)}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter payment amount"
              min="0"
              max={invoice.remainingBalance}
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <Select
              value={method}
              onValueChange={(value) => setMethod(value as Payment['method'])}
            >
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="credit_card">Credit Card</option>
              <option value="other">Other</option>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <Input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add payment notes (optional)"
          />
        </div>

        <Button type="submit" disabled={!amount || parseFloat(amount) <= 0}>
          Record Payment
        </Button>
      </form>

      {invoice.payments.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-2">Payment History</h4>
          <div className="space-y-2">
            {invoice.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <div>
                  <div className="font-medium">{formatCurrency(payment.amount)}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(payment.date).toLocaleDateString()} - {payment.method}
                  </div>
                </div>
                {payment.notes && (
                  <div className="text-sm text-gray-500">{payment.notes}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 