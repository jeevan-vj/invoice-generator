import { z } from "zod";

// Zod schemas for validation
export const clientSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  taxInfo: z.object({
    taxId: z.string().optional(),
    taxRate: z.number().min(0).max(100).optional(),
  }),
  notes: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// TypeScript interfaces
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: ClientAddress;
  taxInfo: ClientTaxInfo;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ClientTaxInfo {
  taxId?: string;
  taxRate?: number;
}

// Mock data
const mockClients: Client[] = [
  {
    id: "1",
    name: "Acme Corporation",
    email: "contact@acme.com",
    phone: "+1 (555) 123-4567",
    address: {
      street: "123 Business Ave",
      city: "San Francisco",
      state: "CA",
      postalCode: "94105",
      country: "United States",
    },
    taxInfo: {
      taxId: "12-3456789",
      taxRate: 8.5,
    },
    notes: "Premium client with regular monthly orders",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-03-15T10:30:00Z",
  },
  {
    id: "2",
    name: "TechStart Inc",
    email: "billing@techstart.com",
    phone: "+1 (555) 987-6543",
    address: {
      street: "456 Innovation Blvd",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "United States",
    },
    taxInfo: {
      taxId: "98-7654321",
      taxRate: 8.875,
    },
    notes: "Startup client with growing needs",
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-03-20T15:45:00Z",
  },
];

// Simulated delay function
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
export const clientsApi = {
  getClients: async (): Promise<Client[]> => {
    await delay(1000);
    return mockClients;
  },

  getClient: async (id: string): Promise<Client | null> => {
    await delay(500);
    const client = mockClients.find((c) => c.id === id);
    return client || null;
  },

  createClient: async (data: Omit<Client, "id" | "createdAt" | "updatedAt">): Promise<Client> => {
    await delay(1000);
    const newClient: Client = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockClients.push(newClient);
    return newClient;
  },

  updateClient: async (id: string, data: Partial<Client>): Promise<Client> => {
    await delay(1000);
    const index = mockClients.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error("Client not found");
    }
    const updatedClient: Client = {
      ...mockClients[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    mockClients[index] = updatedClient;
    return updatedClient;
  },

  deleteClient: async (id: string): Promise<void> => {
    await delay(1000);
    const index = mockClients.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error("Client not found");
    }
    mockClients.splice(index, 1);
  },
}; 