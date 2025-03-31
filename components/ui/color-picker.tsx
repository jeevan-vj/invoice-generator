"use client"

import { useState } from 'react';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full border"
              style={{ backgroundColor: value }}
            />
            {value || 'Pick a color'}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="h-10 w-full"
            />
            <Input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[
              '#000000',
              '#ffffff',
              '#ff0000',
              '#00ff00',
              '#0000ff',
              '#ffff00',
              '#ff00ff',
              '#00ffff',
              '#808080',
              '#c0c0c0',
              '#800000',
              '#808000',
              '#008000',
              '#800080',
              '#008080',
              '#000080',
            ].map((color) => (
              <button
                key={color}
                className="h-8 w-8 rounded-full border"
                style={{ backgroundColor: color }}
                onClick={() => onChange(color)}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
