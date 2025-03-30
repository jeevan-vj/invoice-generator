"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientForm } from "@/app/components/dashboard/clients/client-form";
import { clientsApi } from "@/app/api/mocks/clients";
import { useRouter } from "next/navigation";
import { Client } from "@/app/api/mocks/clients";
import { useEffect, useState } from "react";

export default function EditClientPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadClient = async () => {
      try {
        const data = await clientsApi.getClient(params.id);
        setClient(data);
      } catch (error) {
        console.error("Failed to load client:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClient();
  }, [params.id]);

  const handleSubmit = async (data: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    try {
      await clientsApi.updateClient(params.id, data);
      router.push("/dashboard/clients");
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Client</h1>
        <p className="text-muted-foreground">
          Update client information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm client={client} onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
} 