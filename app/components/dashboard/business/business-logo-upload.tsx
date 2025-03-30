import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BusinessProfile } from "@/app/api/mocks/business-profile";
import Image from "next/image";
import { Building2, Upload, Trash2 } from "lucide-react";

interface BusinessLogoUploadProps {
  profile: BusinessProfile | null;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
  isLoading?: boolean;
}

export function BusinessLogoUpload({
  profile,
  onUpload,
  onDelete,
  isLoading = false,
}: BusinessLogoUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      await onUpload(file);
      toast({
        title: "Success",
        description: "Logo uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete();
      toast({
        title: "Success",
        description: "Logo deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Logo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          {profile?.logo ? (
            <div className="relative h-24 w-24 overflow-hidden rounded-lg">
              <Image
                src={profile.logo}
                alt={`${profile.companyName} logo`}
                fill
                className="object-cover"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-8 w-8"
                onClick={handleDelete}
                disabled={isDeleting || isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-muted">
              <Building2 className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 space-y-2">
            <p className="text-sm text-muted-foreground">
              Upload your company logo. Recommended size: 200x200px. Max file size: 5MB.
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="relative"
                disabled={isUploading || isLoading}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={handleFileChange}
                  disabled={isUploading || isLoading}
                />
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? "Uploading..." : "Upload Logo"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 