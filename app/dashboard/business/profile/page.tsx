"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessProfile, businessProfileApi } from "@/app/api/mocks/business-profile";
import { BusinessPreviewCard } from "@/app/components/dashboard/business/business-preview-card";
import { BusinessInfoForm } from "@/app/components/dashboard/business/business-info-form";
import { BusinessAddressForm } from "@/app/components/dashboard/business/business-address-form";
import { BusinessTaxForm } from "@/app/components/dashboard/business/business-tax-form";
import { BusinessLogoUpload } from "@/app/components/dashboard/business/business-logo-upload";
import { useToast } from "@/components/ui/use-toast";

export default function BusinessProfilePage() {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await businessProfileApi.getProfile();
      setProfile(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load business profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (data: Partial<BusinessProfile>) => {
    try {
      const updatedProfile = await businessProfileApi.updateProfile(data);
      setProfile(updatedProfile);
    } catch (error) {
      throw error;
    }
  };

  const handleUploadLogo = async (file: File) => {
    try {
      const logoUrl = await businessProfileApi.uploadLogo(file);
      await handleUpdateProfile({ logo: logoUrl });
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteLogo = async () => {
    try {
      await businessProfileApi.deleteLogo();
      await handleUpdateProfile({ logo: undefined });
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Business Profile</h1>
        <p className="text-muted-foreground">
          Manage your business information and settings
        </p>
      </div>

      <BusinessPreviewCard profile={profile} isLoading={isLoading} />

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Basic Information</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="tax">Tax Information</TabsTrigger>
          <TabsTrigger value="logo">Logo</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <BusinessInfoForm
                profile={profile}
                onUpdate={handleUpdateProfile}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address">
          <Card>
            <CardHeader>
              <CardTitle>Business Address</CardTitle>
            </CardHeader>
            <CardContent>
              <BusinessAddressForm
                profile={profile}
                onUpdate={handleUpdateProfile}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax">
          <Card>
            <CardHeader>
              <CardTitle>Tax Information</CardTitle>
            </CardHeader>
            <CardContent>
              <BusinessTaxForm
                profile={profile}
                onUpdate={handleUpdateProfile}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo">
          <BusinessLogoUpload
            profile={profile}
            onUpload={handleUploadLogo}
            onDelete={handleDeleteLogo}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 