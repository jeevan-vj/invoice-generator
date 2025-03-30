import { z } from "zod";

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

// Zod schemas for validation
export const businessProfileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
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
});

// Mock data
const mockBusinessProfile: BusinessProfile = {
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
};

// Simulated delay function
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
export const businessProfileApi = {
  getProfile: async (): Promise<BusinessProfile> => {
    await delay(1000); // Simulate network delay
    return mockBusinessProfile;
  },

  updateProfile: async (data: Partial<BusinessProfile>): Promise<BusinessProfile> => {
    await delay(1000);
    // Simulate random error (10% chance)
    if (Math.random() < 0.1) {
      throw new Error("Failed to update profile");
    }
    return {
      ...mockBusinessProfile,
      ...data,
      updatedAt: new Date().toISOString(),
    };
  },

  uploadLogo: async (file: File): Promise<string> => {
    await delay(2000);
    // Simulate random error (10% chance)
    if (Math.random() < 0.1) {
      throw new Error("Failed to upload logo");
    }
    return "https://acme.com/new-logo.png";
  },

  deleteLogo: async (): Promise<void> => {
    await delay(1000);
    // Simulate random error (10% chance)
    if (Math.random() < 0.1) {
      throw new Error("Failed to delete logo");
    }
  },
}; 