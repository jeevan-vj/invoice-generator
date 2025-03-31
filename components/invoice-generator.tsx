'use client';

import { useState, useEffect, useRef, Suspense, useCallback } from 'react';
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
  Settings2,
  Building2,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { TemplateSelector, TemplateOption } from './template-selector';
import { ModernTemplate } from './invoice-templates/modern';
import { MinimalTemplate } from './invoice-templates/minimal';

import { BrandedTemplate } from './invoice-templates/branded';
import { ExecutiveTemplate } from './invoice-templates/executive';
import { PremiumTemplate } from './invoice-templates/premium';
import { useInvoices } from '@/lib/contexts/invoice-context';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { getInvoiceService } from '@/lib/services/invoice-service';
import { Header } from '@/components/header';
import { InvoiceAdjustments } from './invoice-adjustments';
import { calculateSubtotal } from '@/utils/calculations';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { InvoiceNumberConfig } from "@/types/invoice"
import { InvoiceNumberConfig as InvoiceNumberConfigComponent } from "@/components/invoice-number-config"
import { InvoiceNumberService } from "@/lib/services/invoice-number-service"
import { businessProfileApi, BusinessProfile, BusinessProfileError } from '@/app/api/mocks/business-profile';
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ClientPickerModal } from './client-picker-modal';
import { Client } from '@/types/client';
import { InvoiceItem } from '@/types/invoice';

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
  total: 0,
  payments: [],
  remainingBalance: 0
};

// Add proper type for form data
interface InvoiceFormData {
  sender: CompanyDetails;
  recipient: CompanyDetails;
  items: InvoiceItem[];
  taxRate: number;
  memo: string;
  invoiceNumber: string;
  dueDate: string;
}

export default function InvoiceGenerator() {
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const { currentInvoice, saveInvoice, setCurrentInvoice, loading, error } =
    useInvoices();
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('id');

  // Memoize the memo text replacement function
  const replaceMemoVariables = useCallback((text: string, profile: BusinessProfile, invoiceNumber: string) => {
    return text
      .replace(/{companyName}/g, profile.companyName)
      .replace(/{date}/g, new Date().toLocaleDateString())
      .replace(/{invoiceNumber}/g, invoiceNumber);
  }, []);

  // Memoize the checkProfileChanges function
  const checkProfileChanges = useCallback((sender: CompanyDetails, businessProfile: BusinessProfile | null) => {
    if (!businessProfile) return false;
    
    return (
      sender.firstName !== businessProfile.companyName ||
      sender.email !== businessProfile.email ||
      sender.phone !== businessProfile.phone ||
      sender.address?.street !== businessProfile.address.street ||
      sender.address?.city !== businessProfile.address.city ||
      sender.address?.state !== businessProfile.address.state ||
      sender.address?.zipCode !== businessProfile.address.postalCode ||
      sender.address?.country !== businessProfile.address.country
    );
  }, []);

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
  const [invoiceNumberConfig, setInvoiceNumberConfig] = useState<InvoiceNumberConfig>({
    format: "dd-mm-nn",
    prefix: "INV-",
    suffix: "",
    startNumber: 1,
    padding: 3,
    includeYear: true,
    includeMonth: true,
    separator: "-"
  })
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const { toast } = useToast();
  const [hasUnsavedProfileChanges, setHasUnsavedProfileChanges] = useState(false);

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

  useEffect(() => {
    if (!invoiceId) {
      const service = InvoiceNumberService.getInstance()
      const nextNumber = service.generateNextNumber()
      setInvoiceData(prev => ({ ...prev, invoiceNumber: nextNumber }))
    }
  }, [invoiceId])

  useEffect(() => {
    // Load settings from service
    const service = InvoiceNumberService.getInstance()
    const savedConfig = service.getConfig()
    setInvoiceNumberConfig(savedConfig)
  }, [])

  // Load business profile on mount with proper error handling
  useEffect(() => {
    const loadBusinessProfile = async () => {
      try {
        const profile = await businessProfileApi.getProfile();
        setBusinessProfile(profile);
        
        // Apply memo settings if enabled
        if (profile.memoSettings.enabled && !invoiceId) {
          const memoText = replaceMemoVariables(
            profile.memoSettings.defaultText,
            profile,
            invoiceData.invoiceNumber
          );
            
          setInvoiceData(prev => ({
            ...prev,
            memo: memoText
          }));
        }
      } catch (error) {
        if (error instanceof BusinessProfileError) {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        } else {
          console.error('Failed to load business profile:', error);
          toast({
            title: "Error",
            description: "Failed to load business profile. Please try again.",
            variant: "destructive",
          });
        }
      }
    };
    loadBusinessProfile();
  }, [invoiceId, replaceMemoVariables]);

  // Update hasUnsavedProfileChanges when sender details change
  useEffect(() => {
    setHasUnsavedProfileChanges(checkProfileChanges(invoiceData.sender, businessProfile));
  }, [invoiceData.sender, businessProfile, checkProfileChanges]);

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

  const handleUseBusinessProfile = async () => {
    try {
      if (!businessProfile) {
        throw new BusinessProfileError("Business profile not found", "PROFILE_NOT_FOUND");
      }

      setInvoiceData(prev => ({
        ...prev,
        sender: {
          ...prev.sender,
          firstName: businessProfile.companyName,
          email: businessProfile.email,
          phone: businessProfile.phone,
          address: {
            street: businessProfile.address.street,
            city: businessProfile.address.city,
            state: businessProfile.address.state,
            zipCode: businessProfile.address.postalCode,
            country: businessProfile.address.country,
          },
          logo: businessProfile.logo,
        },
        taxRate: businessProfile.taxInfo.taxRate,
      }));

      setHasUnsavedProfileChanges(false);
      
      toast({
        title: "Success",
        description: "Business profile details applied successfully.",
        duration: 3000,
      });
    } catch (error) {
      if (error instanceof BusinessProfileError) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
          duration: 3000,
        });
      } else {
        console.error('Failed to apply business profile:', error);
        toast({
          title: "Error",
          description: "Failed to apply business profile. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };

  const handleSaveAsBusinessProfile = async () => {
    try {
      if (!invoiceData.sender.address) {
        toast({
          title: "Error",
          description: "Please fill in all address details before saving as business profile.",
          variant: "destructive",
        });
        return;
      }

      const profileData = {
        companyName: invoiceData.sender.companyName || invoiceData.sender.firstName,
        email: invoiceData.sender.email,
        phone: invoiceData.sender.phone || "",
        address: {
          street: invoiceData.sender.address.street || "",
          city: invoiceData.sender.address.city || "",
          state: invoiceData.sender.address.state || "",
          postalCode: invoiceData.sender.address.zipCode || "",
          country: invoiceData.sender.address.country || "",
        },
        taxInfo: {
          taxId: "TAX" + Math.random().toString(36).substr(2, 9),
          taxType: "VAT" as const,
          taxRate: invoiceData.taxRate,
          taxNumber: "",
        },
        logo: invoiceData.sender.logo || "",
      };

      await businessProfileApi.updateProfile(profileData);
      setBusinessProfile(profileData as BusinessProfile);
      setHasUnsavedProfileChanges(false);
      
      toast({
        title: "Success",
        description: "Your business profile has been saved successfully.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to save business profile:', error);
      toast({
        title: "Error",
        description: "Failed to save business profile. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
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
      {!isDashboard && <Header />}
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
                    {invoiceId ? 'Edit Invoice' : 'Create your invoice'}
                  </h1>
                  {!invoiceId && (
                    <meta
                      name="description"
                      content="Generate a professional invoice instantly with our free online invoice generator"
                    />
                  )}
                </header>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Your info</h2>
                    <div className="flex gap-2">
                      {businessProfile ? (
                        <>
                          {hasUnsavedProfileChanges ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleSaveAsBusinessProfile}
                              className="flex items-center gap-2"
                            >
                              <Building2 className="h-4 w-4" />
                              Save Business Profile
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleUseBusinessProfile}
                              className="flex items-center gap-2"
                            >
                              <Building2 className="h-4 w-4" />
                              Use Business Profile
                            </Button>
                          )}
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSaveAsBusinessProfile}
                          className="flex items-center gap-2"
                        >
                          <Building2 className="h-4 w-4" />
                          Save as Business Profile
                        </Button>
                      )}
                    </div>
                  </div>
                  <CompanyDetailsForm
                    title="Your Company Details"
                    data={invoiceData.sender}
                    onChange={(sender) =>
                      setInvoiceData({ ...invoiceData, sender })
                    }
                    isBusinessProfile={true}
                    showBusinessProfileIndicator={!!businessProfile}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Client Details</h2>
                    <ClientPickerModal
                      onClientSelect={(client: Client) => {
                        setInvoiceData(prev => ({
                          ...prev,
                          client: {
                            firstName: client.firstName,
                            lastName: client.lastName,
                            email: client.email,
                            phone: client.phone,
                            address: client.address,
                            companyName: client.companyName
                          }
                        }));
                      }}
                    />
                  </div>
                  <CompanyDetailsForm
                    title="Client Details"
                    data={invoiceData.client}
                    onChange={(client) =>
                      setInvoiceData({ ...invoiceData, client })
                    }
                    isBusinessProfile={false}
                    showBusinessProfileIndicator={false}
                  />
                </div>

                <section className="space-y-4" aria-label="Invoice Information">
                  <h2 className="text-lg font-medium">Invoice info</h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="invoice-number">Invoice #</Label>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Settings2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Invoice Number Settings</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <p className="text-sm text-muted-foreground mb-4">
                                Invoice number settings are managed globally in your business settings.
                                Click below to configure your invoice number format.
                              </p>
                              <Button
                                onClick={() => router.push("/dashboard/settings")}
                                className="w-full"
                              >
                                Go to Settings
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="memo">Memo</Label>
                      {businessProfile?.memoSettings.enabled && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            let memoText = businessProfile.memoSettings.defaultText;
                            memoText = memoText
                              .replace(/{companyName}/g, businessProfile.companyName)
                              .replace(/{date}/g, new Date().toLocaleDateString())
                              .replace(/{invoiceNumber}/g, invoiceData.invoiceNumber);
                            setInvoiceData(prev => ({ ...prev, memo: memoText }));
                          }}
                        >
                          Reset to Default
                        </Button>
                      )}
                    </div>
                    <Textarea
                      id="memo"
                      placeholder={businessProfile?.memoSettings.placeholder || "Additional notes..."}
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
