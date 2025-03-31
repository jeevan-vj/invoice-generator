'use client';

import { useState, useEffect } from 'react';
import { Client } from '@/types/client';
import { clientService } from '@/lib/services/client-service';
import { CompanyDetailsForm } from './company-details-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus } from 'lucide-react';
import { CompanyDetails } from '@/types/invoice';

interface ClientPickerModalProps {
  onClientSelect: (client: Client) => void;
  trigger?: React.ReactNode;
}

export function ClientPickerModal({ onClientSelect, trigger }: ClientPickerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newClient, setNewClient] = useState<CompanyDetails>({
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
  });
  const { toast } = useToast();

  useEffect(() => {
    if (searchQuery) {
      const searchClients = async () => {
        const results = await clientService.searchClients(searchQuery);
        setClients(results);
      };
      searchClients();
    } else {
      setClients([]);
    }
  }, [searchQuery]);

  const handleCreateClient = async () => {
    try {
      const createdClient = await clientService.createClient({
        firstName: newClient.firstName,
        lastName: newClient.lastName,
        email: newClient.email,
        phone: newClient.phone || '',
        address: {
          street: newClient.address?.street || '',
          city: newClient.address?.city || '',
          state: newClient.address?.state || '',
          zipCode: newClient.address?.zipCode || '',
          country: newClient.address?.country || '',
        },
        companyName: newClient.companyName
      });
      onClientSelect(createdClient);
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Client created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create client. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSelectClient = (client: Client) => {
    onClientSelect(client);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Select Client</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Client</DialogTitle>
        </DialogHeader>
        
        {!isCreating ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setIsCreating(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Client
              </Button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="p-4 border rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => handleSelectClient(client)}
                >
                  <div className="font-medium">
                    {client.companyName || `${client.firstName} ${client.lastName}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {client.email}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <CompanyDetailsForm
              title="New Client Details"
              data={newClient}
              onChange={setNewClient}
              isBusinessProfile={false}
              showBusinessProfileIndicator={false}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateClient}>
                Create Client
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 