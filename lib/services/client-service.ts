import { Client } from '@/types/client';

class ClientService {
  private static instance: ClientService;
  private clients: Client[] = [];

  private constructor() {}

  static getInstance(): ClientService {
    if (!ClientService.instance) {
      ClientService.instance = new ClientService();
    }
    return ClientService.instance;
  }

  async searchClients(query: string): Promise<Client[]> {
    // TODO: Replace with actual API call
    return this.clients.filter(client => 
      client.firstName.toLowerCase().includes(query.toLowerCase()) ||
      client.lastName.toLowerCase().includes(query.toLowerCase()) ||
      client.email.toLowerCase().includes(query.toLowerCase()) ||
      client.companyName?.toLowerCase().includes(query.toLowerCase())
    );
  }

  async createClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    // TODO: Replace with actual API call
    const newClient: Client = {
      ...client,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.clients.push(newClient);
    return newClient;
  }

  async getClient(id: string): Promise<Client | null> {
    // TODO: Replace with actual API call
    return this.clients.find(client => client.id === id) || null;
  }

  async updateClient(id: string, client: Partial<Client>): Promise<Client | null> {
    // TODO: Replace with actual API call
    const index = this.clients.findIndex(c => c.id === id);
    if (index === -1) return null;

    this.clients[index] = {
      ...this.clients[index],
      ...client,
      updatedAt: new Date()
    };
    return this.clients[index];
  }
}

export const clientService = ClientService.getInstance(); 