'use client';

import { useState } from 'react';
import { Template } from '@/types/template';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ColorPicker } from '@/components/ui/color-picker';

interface TemplateEditorProps {
  template: Template;
  onChange: (template: Template) => void;
}

export function TemplateEditor({ template, onChange }: TemplateEditorProps) {
  const [activeTab, setActiveTab] = useState('content');

  const handleThemeChange = (key: string, value: any) => {
    onChange({
      ...template,
      theme: {
        ...template.theme,
        [key]: value,
      },
    });
  };

  const handleFontChange = (key: string, value: string) => {
    onChange({
      ...template,
      theme: {
        ...template.theme,
        fonts: {
          ...template.theme.fonts,
          [key]: value,
        },
      },
    });
  };

  const handleSpacingChange = (key: string, value: string) => {
    onChange({
      ...template,
      theme: {
        ...template.theme,
        spacing: {
          ...template.theme.spacing,
          [key]: value,
        },
      },
    });
  };

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="space-y-2">
            <Label>Template Content</Label>
            <Textarea
              value={template.content}
              onChange={(e) =>
                onChange({ ...template, content: e.target.value })
              }
              className="min-h-[400px] font-mono"
              placeholder="Enter template content..."
            />
          </div>
        </TabsContent>

        <TabsContent value="theme" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Colors</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <ColorPicker
                  value={template.theme.primary}
                  onChange={(value) => handleThemeChange('primary', value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <ColorPicker
                  value={template.theme.secondary}
                  onChange={(value) => handleThemeChange('secondary', value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Typography</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Heading Font</Label>
                <Select
                  value={template.theme.fonts.heading}
                  onValueChange={(value) => handleFontChange('heading', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Body Font</Label>
                <Select
                  value={template.theme.fonts.body}
                  onValueChange={(value) => handleFontChange('body', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Spacing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Padding</Label>
                <Input
                  value={template.theme.spacing.padding}
                  onChange={(e) =>
                    handleSpacingChange('padding', e.target.value)
                  }
                  placeholder="e.g., 1rem"
                />
              </div>
              <div className="space-y-2">
                <Label>Margin</Label>
                <Input
                  value={template.theme.spacing.margin}
                  onChange={(e) =>
                    handleSpacingChange('margin', e.target.value)
                  }
                  placeholder="e.g., 1rem"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
} 