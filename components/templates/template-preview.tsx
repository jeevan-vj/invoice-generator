'use client';

import { useEffect, useState } from 'react';
import { Template } from '@/types/template';
import { templateService } from '@/lib/services/template-service';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { InvoiceData } from '@/types/invoice';

interface TemplatePreviewProps {
  templateId: string;
}

const mockInvoiceData: InvoiceData = {
  sender: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1 234 567 890',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
  },
  client: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '+1 234 567 891',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
    },
  },
  invoiceNumber: 'INV-001',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: '2024-04-30',
  items: [
    {
      id: '1',
      description: 'Web Design',
      quantity: 1,
      price: 1000,
    },
    {
      id: '2',
      description: 'Development',
      quantity: 2,
      price: 500,
    },
  ],
  taxRate: 10,
  adjustments: [],
  status: 'draft',
  total: 2000,
};

export function TemplatePreview({ templateId }: TemplatePreviewProps) {
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplate();
  }, [templateId]);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      const data = await templateService.getTemplate(templateId);
      setTemplate(data);
    } catch (err) {
      setError('Failed to load template');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // Implement PDF download logic here
    console.log('Downloading template...');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-destructive">{error || 'Template not found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/templates">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{template.name}</h1>
            <p className="text-muted-foreground">{template.description}</p>
          </div>
        </div>
        <Button onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <Card className="p-8">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold" style={{ color: template.theme.primary }}>
                Invoice
              </h2>
              <p className="text-muted-foreground">#{mockInvoiceData.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Issue Date: {mockInvoiceData.issueDate}
              </p>
              <p className="text-sm text-muted-foreground">
                Due Date: {mockInvoiceData.dueDate}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">From</h3>
              <p>{mockInvoiceData.sender.firstName} {mockInvoiceData.sender.lastName}</p>
              <p>{mockInvoiceData.sender.email}</p>
              <p>{mockInvoiceData.sender.phone}</p>
              <p>
                {mockInvoiceData.sender.address.street}
                <br />
                {mockInvoiceData.sender.address.city}, {mockInvoiceData.sender.address.state} {mockInvoiceData.sender.address.zipCode}
                <br />
                {mockInvoiceData.sender.address.country}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">To</h3>
              <p>{mockInvoiceData.client.firstName} {mockInvoiceData.client.lastName}</p>
              <p>{mockInvoiceData.client.email}</p>
              <p>{mockInvoiceData.client.phone}</p>
              <p>
                {mockInvoiceData.client.address.street}
                <br />
                {mockInvoiceData.client.address.city}, {mockInvoiceData.client.address.state} {mockInvoiceData.client.address.zipCode}
                <br />
                {mockInvoiceData.client.address.country}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left">Description</th>
                  <th className="py-3 text-right">Qty</th>
                  <th className="py-3 text-right">Price</th>
                  <th className="py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {mockInvoiceData.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3">{item.description}</td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-3 text-right">
                      ${(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-4">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${mockInvoiceData.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({mockInvoiceData.taxRate}%)</span>
                  <span>
                    ${((mockInvoiceData.total * mockInvoiceData.taxRate) / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>
                    ${(
                      mockInvoiceData.total +
                      (mockInvoiceData.total * mockInvoiceData.taxRate) / 100
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 