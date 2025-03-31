import { z } from "zod";
import { MemoSettings } from "@/types/memo-settings";

// TypeScript interfaces
export interface BusinessProfile {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  website?: string;
  address: BusinessAddress;
  taxInfo: TaxInformation;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  memoSettings: MemoSettings;
}

export interface BusinessAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface TaxInformation {
  taxId: string;
  taxType: "VAT" | "GST" | "HST" | "None";
  taxRate: number;
  taxNumber?: string;
}

// Custom error class for better error handling
export class BusinessProfileError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'BusinessProfileError';
  }
}

// Improved validation schema with better error messages
export const businessProfileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^\+?[\d\s-()]{10,}$/, "Invalid phone number format"),
  website: z.string().url("Invalid website URL").optional(),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  taxInfo: z.object({
    taxId: z.string().min(1, "Tax ID is required"),
    taxType: z.enum(["VAT", "GST", "HST", "None"]),
    taxRate: z.number().min(0).max(100),
    taxNumber: z.string().optional(),
  }),
  memoSettings: z.object({
    enabled: z.boolean(),
    defaultText: z.string(),
    placeholder: z.string(),
    variables: z.array(z.string())
  })
});

// Mock data
let mockBusinessProfile: BusinessProfile = {
  id: "1",
  companyName: "Acme Corporation",
  email: "contact@acme.com",
  phone: "+1 (555) 123-4567",
  website: "https://acme.com",
  address: {
    street: "123 Business Ave",
    city: "San Francisco",
    state: "CA",
    postalCode: "94105",
    country: "United States",
  },
  taxInfo: {
    taxId: "TAX123456",
    taxType: "VAT",
    taxRate: 20,
    taxNumber: "VAT123456789",
  },
  logo: "https://acme.com/logo.png",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-02-10T00:00:00Z",
  memoSettings: {
    enabled: false,
    defaultText: "",
    placeholder: "Additional notes...",
    variables: ["{companyName}", "{date}", "{invoiceNumber}"]
  }
};

// Simulated delay function
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions with improved error handling
export const businessProfileApi = {
  getProfile: async (): Promise<BusinessProfile> => {
    try {
      await delay(500);
      return mockBusinessProfile;
    } catch (error) {
      throw new BusinessProfileError(
        "Failed to fetch business profile",
        "FETCH_ERROR"
      );
    }
  },

  updateProfile: async (data: Partial<BusinessProfile>): Promise<BusinessProfile> => {
    try {
      await delay(500);
      
      // Validate the data against the schema
      const validatedData = businessProfileSchema.partial().parse(data);

      // Update the mock profile
      mockBusinessProfile = {
        ...mockBusinessProfile,
        ...validatedData,
        updatedAt: new Date().toISOString(),
      };

      return mockBusinessProfile;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new BusinessProfileError(
          "Invalid profile data: " + error.errors.map(e => e.message).join(", "),
          "VALIDATION_ERROR"
        );
      }
      throw new BusinessProfileError(
        "Failed to update business profile",
        "UPDATE_ERROR"
      );
    }
  },

  uploadLogo: async (file: File): Promise<string> => {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new BusinessProfileError(
          "Invalid file type. Only image files are allowed.",
          "INVALID_FILE_TYPE"
        );
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new BusinessProfileError(
          "File too large. Maximum size is 5MB.",
          "FILE_TOO_LARGE"
        );
      }

      await delay(1000);
      return "https://acme.com/new-logo.png";
    } catch (error) {
      if (error instanceof BusinessProfileError) {
        throw error;
      }
      throw new BusinessProfileError(
        "Failed to upload logo",
        "UPLOAD_ERROR"
      );
    }
  },

  deleteLogo: async (): Promise<void> => {
    try {
      await delay(500);
      mockBusinessProfile.logo = undefined;
    } catch (error) {
      throw new BusinessProfileError(
        "Failed to delete logo",
        "DELETE_ERROR"
      );
    }
  },
}; 