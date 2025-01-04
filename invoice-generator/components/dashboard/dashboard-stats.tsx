import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from '@/utils/calculations';
import { DollarSign, FileText, Clock, CheckCircle } from 'lucide-react';

interface DashboardStatsProps {
  invoices: InvoiceData[];
}

export function DashboardStats({ invoices }: DashboardStatsProps) {
  const totalAmount = invoices.reduce((sum, invoice) => {
    const subtotal = invoice.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const tax = (subtotal * invoice.taxRate) / 100;
    return sum + subtotal + tax;
  }, 0);

  const stats = [
    {
      title: 'Total Invoices',
      value: invoices.length,
      icon: FileText,
      description: 'Total invoices created',
    },
    {
      title: 'Total Amount',
      value: formatCurrency(totalAmount),
      icon: DollarSign,
      description: 'Total value of invoices',
    },
    {
      title: 'Pending',
      value: '0',
      icon: Clock,
      description: 'Awaiting payment',
    },
    {
      title: 'Paid',
      value: '0',
      icon: CheckCircle,
      description: 'Completed payments',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
