import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  ZoomIn,
  ZoomOut,
  Printer,
  Smartphone,
  Monitor,
  Sun,
  Moon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';

interface PreviewControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPrint: () => void;
  onDeviceChange: (device: 'mobile' | 'desktop') => void;
  currentDevice: 'mobile' | 'desktop';
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export function PreviewControls({
  onZoomIn,
  onZoomOut,
  onPrint,
  onDeviceChange,
  currentDevice,
  zoom,
  onZoomChange,
}: PreviewControlsProps) {
  const { theme, setTheme } = useTheme();
  const [isPrintPreview, setIsPrintPreview] = useState(false);

  const handlePrint = () => {
    setIsPrintPreview(true);
    onPrint();
    // Reset print preview after a short delay
    setTimeout(() => setIsPrintPreview(false), 1000);
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomOut}
          disabled={zoom <= 0.5}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Slider
          value={[zoom]}
          onValueChange={([value]) => onZoomChange(value)}
          min={0.5}
          max={2}
          step={0.1}
          className="w-32"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={onZoomIn}
          disabled={zoom >= 2}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDeviceChange(currentDevice === 'mobile' ? 'desktop' : 'mobile')}
        >
          {currentDevice === 'mobile' ? (
            <Monitor className="h-4 w-4" />
          ) : (
            <Smartphone className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handlePrint}
          disabled={isPrintPreview}
        >
          <Printer className="h-4 w-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
} 