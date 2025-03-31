import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BusinessProfile } from "@/app/api/mocks/business-profile";
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
import { useToast } from "@/components/ui/use-toast";
import { useState, useCallback } from "react";
import { z } from "zod";

interface BusinessInfoFormProps {
  profile: BusinessProfile | null;
  onUpdate: (data: Partial<BusinessProfile>) => Promise<void>;
  isLoading?: boolean;
}

// Create a specific schema for the form data
const businessInfoSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().regex(/^\+?[\d\s-()]{10,}$/, "Invalid phone number format"),
  website: z.string().url("Invalid website URL").optional(),
});

type FormData = z.infer<typeof businessInfoSchema>;

export function BusinessInfoForm({ profile, onUpdate, isLoading = false }: BusinessInfoFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      companyName: profile?.companyName ?? "",
      email: profile?.email ?? "",
      phone: profile?.phone ?? "",
      website: profile?.website ?? "",
    },
  });

  const onSubmit = useCallback(async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await onUpdate(data);
      toast({
        title: "Success",
        description: "Business information updated successfully.",
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update business information. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [onUpdate, toast]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading || isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" disabled={isLoading || isSubmitting} />
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
                <Input {...field} type="tel" disabled={isLoading || isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input {...field} type="url" disabled={isLoading || isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading || isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
} 