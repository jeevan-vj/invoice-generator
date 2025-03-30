import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessProfile } from "@/app/api/mocks/business-profile";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Building2, Mail, Phone, Globe, MapPin, Receipt } from "lucide-react";

interface BusinessPreviewCardProps {
  profile: BusinessProfile | null;
  isLoading?: boolean;
}

export function BusinessPreviewCard({ profile, isLoading = false }: BusinessPreviewCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No business profile found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          {profile.logo ? (
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image
                src={profile.logo}
                alt={`${profile.companyName} logo`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <div>
            <h3 className="font-semibold">{profile.companyName}</h3>
            <p className="text-sm text-muted-foreground">Last updated: {new Date(profile.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{profile.phone}</p>
            </div>
          </div>

          {profile.website && (
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Website</p>
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:underline"
                >
                  {profile.website}
                </a>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Address</p>
              <p className="text-sm text-muted-foreground">
                {profile.address.street}, {profile.address.city}, {profile.address.state} {profile.address.postalCode}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Tax Information</p>
              <p className="text-sm text-muted-foreground">
                {profile.taxInfo.taxType} ({profile.taxInfo.taxRate}%)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 