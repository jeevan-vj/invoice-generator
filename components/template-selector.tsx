import { Card, CardContent } from '@/components/ui/card';
import { Theme } from '@/types/invoice';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export type TemplateOption =
  | 'classic'
  | 'modern'
  | 'minimal'
  | 'corporate'
  | 'branded'
  | 'executive'
  | 'professional';

interface TemplateSelectorProps {
  selected: TemplateOption;
  onSelect: (template: TemplateOption) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const templates: { value: TemplateOption; label: string; description: string }[] = [
  { value: 'classic', label: 'Classic', description: 'Traditional invoice layout' },
  { value: 'modern', label: 'Modern', description: 'Clean and contemporary design' },
  { value: 'minimal', label: 'Minimal', description: 'Simple and elegant' },
  { value: 'corporate', label: 'Corporate', description: 'Professional business style' },
  { value: 'branded', label: 'Branded', description: 'Custom branded design' },
  { value: 'executive', label: 'Executive', description: 'Premium business template' },
  { value: 'professional', label: 'Professional', description: 'Industry standard layout' },
];

export function TemplateSelector({
  selected,
  onSelect,
  theme,
}: TemplateSelectorProps) {
  return (
    <div className="relative">
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />
      <div
        className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20 scrollbar-track-transparent"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 8px, black calc(100% - 8px), transparent)',
        }}
      >
        <div className="flex gap-4 p-1 min-w-full w-max">
          {templates.map((template) => (
            <Card
              key={template.value}
              className={cn(
                'relative cursor-pointer transition-all hover:scale-105 w-[200px] flex-shrink-0',
                'bg-gradient-to-br',
                selected === template.value && 'ring-2 ring-primary'
              )}
              onClick={() => onSelect(template.value as TemplateOption)}
              style={
                {
                  '--theme-primary': theme.primary,
                  '--theme-secondary': theme.secondary,
                } as React.CSSProperties
              }
            >
              {selected === template.value && (
                <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center">
                  <Check className="h-3 w-3" />
                </div>
              )}
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{template.label.charAt(0)}</div>
                <div className="space-y-1">
                  <h4 className="font-medium">{template.label}</h4>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
