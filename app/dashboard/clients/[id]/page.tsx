"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clientsApi } from "@/app/api/mocks/clients";
import { useRouter } from "next/navigation";
import { Client } from "@/app/api/mocks/clients";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Mail, Phone, MapPin, Receipt, Pencil } from "lucide-react";
import Link from "next/link";

export default function ClientDetailsPage({ params }: { params: { id: string } }) {
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <p className="text-muted-foreground">Client Details</p>
          </div>
        </div>
        <Link href={`/dashboard/clients/${client.id}/edit`}>
          <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Client
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{client.phone}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p>{client.address.street}</p>
              <p>{client.address.city}, {client.address.state} {client.address.postalCode}</p>
              <p>{client.address.country}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Tax Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tax ID</p>
              <p>{client.taxInfo.taxId || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tax Rate</p>
              <p>{client.taxInfo.taxRate ? `${client.taxInfo.taxRate}%` : "Not provided"}</p>
            </div>
          </CardContent>
        </Card>

        {client.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{client.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 