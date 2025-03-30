import { Client } from "@/app/api/mocks/clients";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Phone, MapPin, Building2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

interface ClientListProps {
  clients: Client[];
  isLoading?: boolean;
  onDelete?: (id: string) => Promise<void>;
}

export function ClientList({ clients, isLoading = false, onDelete }: ClientListProps) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    if (!onDelete) return;
    try {
      await onDelete(id);
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-8">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No clients</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new client.
        </p>
        <div className="mt-6">
          <Link href="/dashboard/clients/new">
            <Button>Add Client</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Tax Info</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell>
                <div className="font-medium">{client.name}</div>
                {client.notes && (
                  <div className="text-sm text-muted-foreground">{client.notes}</div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    {client.email}
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    {client.phone}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  {client.address.city}, {client.address.state}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {client.taxInfo.taxId && (
                    <div>Tax ID: {client.taxInfo.taxId}</div>
                  )}
                  {client.taxInfo.taxRate && (
                    <div>Rate: {client.taxInfo.taxRate}%</div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/clients/${client.id}`}>
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/clients/${client.id}/edit`}>
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(client.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 