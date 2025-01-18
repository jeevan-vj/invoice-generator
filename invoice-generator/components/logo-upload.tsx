import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState } from 'react';

interface LogoUploadProps {
  value?: string;
  onChange: (logo: string) => void;
}

export function LogoUpload({ value, onChange }: LogoUploadProps) {
  const [error, setError] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return;
    }

    try {
      // Create a new promise-based FileReader
      const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      };

      const dataUrl = await readFileAsDataURL(file);
      onChange(dataUrl);
    } catch (err) {
      setError('Failed to read the image file');
      console.error('Error reading file:', err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-24 w-24">
        {value ? (
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-primary">
            <Image
              src={value}
              alt="Company logo"
              fill
              className="object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
              onClick={() => onChange('')}
            >
              ×
            </Button>
          </div>
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/50">
            <span className="text-sm text-muted-foreground">No logo</span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="relative"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('logo-upload')?.click();
          }}
        >
          Upload Logo
          <input
            id="logo-upload"
            type="file"
            className="absolute inset-0 cursor-pointer opacity-0"
            accept="image/*"
            onChange={handleFileChange}
            onClick={(e) => e.stopPropagation()}
          />
        </Button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}
