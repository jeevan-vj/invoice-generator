"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientForm } from "@/app/components/dashboard/clients/client-form";
import { clientsApi } from "@/app/api/mocks/clients";
import { useRouter } from "next/navigation";
import { Client } from "@/app/api/mocks/clients";

export default function NewClientPage() {
  const router = useRouter();

  const handleSubmit = async (data: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    try {
      await clientsApi.createClient(data);
      router.push("/dashboard/clients");
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Client</h1>
        <p className="text-muted-foreground">
          Add a new client to your database
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
} 