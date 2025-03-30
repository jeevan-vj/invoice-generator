"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Client, clientsApi } from "@/app/api/mocks/clients";
import { ClientList } from "@/app/components/dashboard/clients/client-list";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientsApi.getClients();
      setClients(data);
    } catch (error) {
      console.error("Failed to load clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClient = async (id: string) => {
    try {
      await clientsApi.deleteClient(id);
      setClients(clients.filter((client) => client.id !== id));
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            Manage your clients and their information
          </p>
        </div>
        <Link href="/dashboard/clients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </Link>
      </div>

      <ClientList
        clients={clients}
        isLoading={isLoading}
        onDelete={handleDeleteClient}
      />
    </div>
  );
} 