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
  | 'executive';

interface TemplateSelectorProps {
  selected: TemplateOption;
  onSelect: (template: TemplateOption) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const templates = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional design',
    thumbnail: '🧾',
    color: 'from-blue-500/20 to-blue-500/5',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary gradient style',
    thumbnail: '📋',
    color: 'from-purple-500/20 to-purple-500/5',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple layout',
    thumbnail: '📝',
    color: 'from-gray-500/20 to-gray-500/5',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Business-focused template',
    thumbnail: '📊',
    color: 'from-green-500/20 to-green-500/5',
  },
  {
    id: 'branded',
    name: 'Branded',
    description: 'Customizable brand-focused design',
    thumbnail: '🎨',
    color: 'from-red-500/20 to-red-500/5',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Premium executive style',
    thumbnail: '👔',
    color: 'from-yellow-500/20 to-yellow-500/5',
  },
] as const;

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
              key={template.id}
              className={cn(
                'relative cursor-pointer transition-all hover:scale-105 w-[200px] flex-shrink-0',
                'bg-gradient-to-br',
                template.color,
                selected === template.id && 'ring-2 ring-primary'
              )}
              onClick={() => onSelect(template.id as TemplateOption)}
              style={
                {
                  '--theme-primary': theme.primary,
                  '--theme-secondary': theme.secondary,
                } as React.CSSProperties
              }
            >
              {selected === template.id && (
                <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center">
                  <Check className="h-3 w-3" />
                </div>
              )}
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{template.thumbnail}</div>
                <div className="space-y-1">
                  <h4 className="font-medium">{template.name}</h4>
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
