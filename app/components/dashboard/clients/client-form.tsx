import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Client, clientSchema } from "@/app/api/mocks/clients";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: Omit<Client, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  isLoading?: boolean;
}

export function ClientForm({ client, onSubmit, isLoading = false }: ClientFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<Omit<Client, "id" | "createdAt" | "updatedAt">>({
    resolver: zodResolver(clientSchema),
    defaultValues: client || {
      name: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
      taxInfo: {
        taxId: "",
        taxRate: 0,
      },
      notes: "",
    },
  });

  const handleSubmit = async (data: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      toast({
        title: "Success",
        description: client ? "Client updated successfully" : "Client created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: client ? "Failed to update client" : "Failed to create client",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter client name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address</h3>
            <FormField
              control={form.control}
              name="address.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter street address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter state" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter postal code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Tax Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="taxInfo.taxId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tax ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxInfo.taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="Enter tax rate"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter any additional notes"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading || isSubmitting}>
          {isSubmitting
            ? client
              ? "Updating..."
              : "Creating..."
            : client
            ? "Update Client"
            : "Create Client"}
        </Button>
      </form>
    </Form>
  );
} 