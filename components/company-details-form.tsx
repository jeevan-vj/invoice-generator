import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CompanyDetails, Address } from '../types/invoice';
import { LogoUpload } from '@/components/logo-upload';
import { Building2, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CompanyDetailsFormProps {
  title: string;
  data: CompanyDetails;
  onChange: (data: CompanyDetails) => void;
  isBusinessProfile?: boolean;
  showBusinessProfileIndicator?: boolean;
}

export function CompanyDetailsForm({
  title,
  data,
  onChange,
  isBusinessProfile = false,
  showBusinessProfileIndicator = false,
}: CompanyDetailsFormProps) {
  const handleChange =
    (field: keyof CompanyDetails) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...data, [field]: e.target.value });
    };

  const handleAddressChange =
    (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({
        ...data,
        address: {
          ...data.address,
          [field]: e.target.value,
        },
      });
    };

  const BusinessProfileIndicator = () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Building2 className="h-4 w-4" />
            <span className="text-xs">Business Profile</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>This field is part of your business profile</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">{title}</h2>
        {showBusinessProfileIndicator && <BusinessProfileIndicator />}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor={`${title}-firstName`}>First name</Label>
            {isBusinessProfile && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This will be your company name in invoices</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <Input
            id={`${title}-firstName`}
            value={data.firstName}
            onChange={handleChange('firstName')}
            placeholder={isBusinessProfile ? "Company Name" : "First name"}
          />
        </div>
        {!isBusinessProfile && (
          <div className="space-y-2">
            <Label htmlFor={`${title}-lastName`}>Last name</Label>
            <Input
              id={`${title}-lastName`}
              value={data.lastName}
              onChange={handleChange('lastName')}
            />
          </div>
        )}
      </div>
      {isBusinessProfile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor={`${title}-company`}>Company name</Label>
            <Input
              id={`${title}-company`}
              value={data.companyName}
              onChange={handleChange('companyName')}
              placeholder="Your company name"
            />
          </div>
          <div className="flex justify-center md:justify-start">
            <LogoUpload
              value={data.logo}
              onChange={(logo) =>
                onChange({
                  ...data,
                  logo,
                })
              }
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${title}-email`}>Email</Label>
          <Input
            id={`${title}-email`}
            type="email"
            value={data.email}
            onChange={handleChange('email')}
            placeholder={isBusinessProfile ? "business@example.com" : "email@example.com"}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title}-phone`}>Phone</Label>
          <Input
            id={`${title}-phone`}
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={data.phone || ''}
            onChange={handleChange('phone')}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <div className="space-y-4">
          <Input
            placeholder="Street Address"
            value={data.address?.street || ''}
            onChange={handleAddressChange('street')}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="City"
              value={data.address?.city || ''}
              onChange={handleAddressChange('city')}
            />
            <Input
              placeholder="State/Province"
              value={data.address?.state || ''}
              onChange={handleAddressChange('state')}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="ZIP/Postal Code"
              value={data.address?.zipCode || ''}
              onChange={handleAddressChange('zipCode')}
            />
            <Input
              placeholder="Country"
              value={data.address?.country || ''}
              onChange={handleAddressChange('country')}
            />
          </div>
        </div>
      </div>
      {!isBusinessProfile && (
        <>
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              onChange({ ...data, companyName: data.companyName || '' })
            }
          >
            + Company
          </Button>
          {data.companyName !== undefined && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`${title}-company`}>Company name</Label>
                <Input
                  id={`${title}-company`}
                  value={data.companyName}
                  onChange={handleChange('companyName')}
                />
              </div>
              <div className="flex justify-center md:justify-start">
                <LogoUpload
                  value={data.logo}
                  onChange={(logo) =>
                    onChange({
                      ...data,
                      logo,
                    })
                  }
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
