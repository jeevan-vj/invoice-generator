import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BusinessProfile, businessProfileSchema } from "@/app/api/mocks/business-profile";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface BusinessTaxFormProps {
  profile: BusinessProfile | null;
  onUpdate: (data: Partial<BusinessProfile>) => Promise<void>;
  isLoading?: boolean;
}

type FormData = Pick<BusinessProfile, "taxInfo">;

export function BusinessTaxForm({ profile, onUpdate, isLoading = false }: BusinessTaxFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      taxInfo: {
        taxId: profile?.taxInfo.taxId ?? "",
        taxType: profile?.taxInfo.taxType ?? "None",
        taxRate: profile?.taxInfo.taxRate ?? 0,
        taxNumber: profile?.taxInfo.taxNumber ?? "",
      },
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await onUpdate(data);
      toast({
        title: "Success",
        description: "Tax information updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tax information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          name="taxInfo.taxType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tax type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="VAT">VAT</SelectItem>
                  <SelectItem value="GST">GST</SelectItem>
                  <SelectItem value="HST">HST</SelectItem>
                  <SelectItem value="None">None</SelectItem>
                </SelectContent>
              </Select>
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

        <FormField
          control={form.control}
          name="taxInfo.taxNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax Number (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter tax number" {...field} />
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