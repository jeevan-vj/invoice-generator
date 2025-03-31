import { useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface AutoSaveOptions {
  delay?: number;
  onSave: (data: any) => Promise<void>;
  onError?: (error: Error) => void;
}

export function useAutoSave<T>(data: T, options: AutoSaveOptions) {
  const { delay = 2000, onSave, onError } = options;
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await onSave(data);
        toast({
          title: "Auto-saved",
          description: "Your changes have been saved.",
          duration: 2000,
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
        if (onError) {
          onError(error as Error);
        }
        toast({
          title: "Auto-save failed",
          description: "Failed to save your changes. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, onSave, onError, toast]);
} 