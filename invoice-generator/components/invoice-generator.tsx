'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CompanyDetailsForm } from './company-details-form';
import { InvoiceItems } from './invoice-items';
import { InvoicePreview } from './invoice-preview';
import { InvoiceData, CompanyDetails } from '../types/invoice';
import {
  BanknoteIcon as Bank,
  CreditCard,
  ShoppingCartIcon as Paypal,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { TemplateSelector, TemplateOption } from './template-selector';
import { ModernTemplate } from './invoice-templates/modern';
import { MinimalTemplate } from './invoice-templates/minimal';

import { BrandedTemplate } from './invoice-templates/branded';
import { ExecutiveTemplate } from './invoice-templates/executive';
import { PremiumTemplate } from './invoice-templates/premium';
import { useInvoices } from '@/lib/contexts/invoice-context';
import { useSearchParams, useRouter } from 'next/navigation';
import { getInvoiceService } from '@/lib/services/invoice-service';
import { Header } from '@/components/header';
import { InvoiceAdjustments } from './invoice-adjustments';
import { calculateSubtotal } from '@/utils/calculations';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';

//const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink), { ssr: false })
//const InvoicePDF = dynamic(() => import('./components/invoice-pdf'), { ssr: false })

const emptyCompanyDetails: CompanyDetails = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
};

const initialInvoiceData: InvoiceData = {
  sender: emptyCompanyDetails,
  client: emptyCompanyDetails,
  invoiceNumber: '23-001',
  issueDate: new Date().toISOString().split('T')[0],
  dueDate: 'Upon Receipt',
  items: [],
  taxRate: 0,
  adjustments: [],
  status: 'draft',
  total: 0
};

export default function InvoiceGenerator() {
  const router = useRouter();
  const { currentInvoice, saveInvoice, setCurrentInvoice, loading, error } =
    useInvoices();
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('id');

  const [invoiceData, setInvoiceData] =
    useState<InvoiceData>(initialInvoiceData);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateOption>('classic');
  const [isPDFReady, setIsPDFReady] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState({
    primary: '#0066cc',
    secondary: '#4d4d4d',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Sync invoiceData with currentInvoice when it changes
  useEffect(() => {
    if (currentInvoice) {
      setInvoiceData(currentInvoice);
    }
  }, [currentInvoice]);

  useEffect(() => {
    const loadInvoice = async () => {
      if (!invoiceId) return;

      setIsLoading(true);
      try {
        const service = getInvoiceService();
        const response = await service.getInvoice(invoiceId);

        if (response.error) {
          throw new Error(response.error);
        }

        if (response.data) {
          const invoiceData = {
            ...response.data,
            adjustments: response.data.adjustments || [],
          };
          setInvoiceData(invoiceData);
          setCurrentInvoice(response.data);
        }
      } catch (error) {
        console.error('Failed to load invoice:', error);
        // Show error toast or notification here
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoice();
  }, [invoiceId, setCurrentInvoice]);

  useEffect(() => {
    setIsPDFReady(true);
  }, []);

  const generatePDF = async () => {
    try {
      if (!invoiceRef.current || !invoiceData) return;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfElement = invoiceRef.current;

      return new Promise<void>((resolve) => {
        pdf.html(pdfElement, {
          callback: function (pdf) {
            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            setInvoiceData((prev) => ({ ...prev, pdfUrl }));
            pdf.save(
              `invoice_${invoiceData.invoiceNumber.replace(/\s+/g, '_')}.pdf`
            );
            resolve();
          },
          x: 10,
          y: 10,
          width: 190,
          windowWidth: 650,
        });
      });
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'modern':
        return <ModernTemplate data={invoiceData} theme={theme} />;
      case 'minimal':
        return <MinimalTemplate data={invoiceData} theme={theme} />;
      case 'corporate':
        return <PremiumTemplate data={invoiceData} theme={theme} />;
      case 'branded':
        return <BrandedTemplate data={invoiceData} theme={theme} />;
      case 'executive':
        return <ExecutiveTemplate data={invoiceData} theme={theme} />;
      default:
        return <InvoicePreview data={invoiceData} theme={theme} />;
    }
  };

  const handleSave = async () => {
    try {
      if (!invoiceData.pdfUrl) {
        await generatePDF();
      }
      await saveInvoice(invoiceData);
      // Navigate to invoices list after successful save
      router.push('/dashboard/invoices');
    } catch (err) {
      console.error('Failed to save invoice:', err);
      // Show error toast or notification here
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading invoice...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <Suspense fallback={<div>Loading...</div>}>
          <div className="container mx-auto p-8 space-y-8">
            <TemplateSelector
              selected={selectedTemplate}
              onSelect={setSelectedTemplate}
              theme={theme}
              onThemeChange={setTheme}
            />
            <div className="grid gap-8 lg:grid-cols-2">
              <article className="space-y-8">
                <header>
                  <h1 className="text-3xl font-semibold text-foreground">
                    Create your invoice
                  </h1>
                  <meta
                    name="description"
                    content="Generate a professional invoice instantly with our free online invoice generator"
                  />
                </header>

                <CompanyDetailsForm
                  title="Your info"
                  data={invoiceData.sender}
                  onChange={(sender) =>
                    setInvoiceData({ ...invoiceData, sender })
                  }
                />

                <CompanyDetailsForm
                  title="Client info"
                  data={invoiceData.client}
                  onChange={(client) =>
                    setInvoiceData({ ...invoiceData, client })
                  }
                />

                <section className="space-y-4" aria-label="Invoice Information">
                  <h2 className="text-lg font-medium">Invoice info</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoice-number">Invoice #</Label>
                      <Input
                        id="invoice-number"
                        value={invoiceData.invoiceNumber}
                        onChange={(e) =>
                          setInvoiceData({
                            ...invoiceData,
                            invoiceNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issue-date">Issued date</Label>
                      <Input
                        id="issue-date"
                        type="date"
                        value={invoiceData.issueDate}
                        onChange={(e) =>
                          setInvoiceData({
                            ...invoiceData,
                            issueDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="due-date">Due date</Label>
                      <Input
                        id="due-date"
                        value={invoiceData.dueDate}
                        onChange={(e) =>
                          setInvoiceData({
                            ...invoiceData,
                            dueDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </section>

                <section aria-label="Invoice Items">
                  <InvoiceItems
                    items={invoiceData.items}
                    onItemsChange={(items) =>
                      setInvoiceData({ ...invoiceData, items })
                    }
                  />
                </section>

                <section aria-label="Invoice Adjustments">
                  <InvoiceAdjustments
                    adjustments={invoiceData.adjustments}
                    subtotal={calculateSubtotal(invoiceData.items)}
                    onAdjustmentsChange={(adjustments) =>
                      setInvoiceData({ ...invoiceData, adjustments })
                    }
                  />
                </section>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label htmlFor="memo">Memo</Label>
                    <Textarea
                      id="memo"
                      placeholder="Additional notes..."
                      value={invoiceData.memo}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, memo: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Label htmlFor="tax-rate">Tax %</Label>
                      <Input
                        id="tax-rate"
                        type="number"
                        className="w-24"
                        value={invoiceData.taxRate}
                        onChange={(e) =>
                          setInvoiceData({
                            ...invoiceData,
                            taxRate: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </article>
              <aside className="space-y-4">
                <div className="overflow-hidden print:shadow-none" ref={invoiceRef}>
                  {renderTemplate()}
                </div>

                <div className="flex gap-4">
                  <Button
                    className="flex-1 bg-primary"
                    size="lg"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading
                      ? 'Saving...'
                      : invoiceId
                      ? 'Update Invoice'
                      : 'Save Invoice'}
                  </Button>
                  <Button
                    className="flex-1"
                    variant="outline"
                    size="lg"
                    onClick={generatePDF}
                  >
                    Generate PDF
                  </Button>
                  {invoiceId && (
                    <Button
                      className="flex-1"
                      variant="outline"
                      size="lg"
                      onClick={() => router.push('/dashboard')}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </aside>
            </div>
          </div>
        </Suspense>
      </main>
      <div className="fixed top-4 right-4">
        {user ? (
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            href="/auth/sign-in"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign In
          </Link>
        )}
      </div>
    </>
  );
}
