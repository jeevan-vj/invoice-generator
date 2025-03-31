import { useState } from "react";
import type { MemoSettings } from "@/types/memo-settings";
import { defaultMemoSettings } from "@/types/memo-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MemoSettingsProps {
  settings: MemoSettings;
  onChange: (settings: MemoSettings) => void;
}

export function MemoSettings({ settings, onChange }: MemoSettingsProps) {
  const [previewText, setPreviewText] = useState(settings.defaultText);

  const handleVariableClick = (variable: string) => {
    const textarea = document.querySelector('textarea[name="defaultText"]') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = settings.defaultText;
      const newText = text.substring(0, start) + variable + text.substring(end);
      onChange({ ...settings, defaultText: newText });
      setPreviewText(newText);
    }
  };

  const handleTextChange = (text: string) => {
    onChange({ ...settings, defaultText: text });
    setPreviewText(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Memo Settings</CardTitle>
        <CardDescription>
          Configure the default memo text that will appear on new invoices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Enable Default Memo</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, new invoices will include your default memo text
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(checked) => onChange({ ...settings, enabled: checked })}
          />
        </div>

        <div className="space-y-2">
          <Label>Default Memo Text</Label>
          <Textarea
            name="defaultText"
            value={settings.defaultText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={settings.placeholder}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Available Variables</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click a variable to insert it at the cursor position</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ScrollArea className="h-[60px] rounded-md border p-2">
            <div className="flex flex-wrap gap-2">
              {settings.variables.map((variable) => (
                <Badge
                  key={variable}
                  variant="secondary"
                  className="cursor-pointer hover:bg-secondary/80"
                  onClick={() => handleVariableClick(variable)}
                >
                  {variable}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-2">
          <Label>Placeholder Text</Label>
          <Input
            value={settings.placeholder}
            onChange={(e) => onChange({ ...settings, placeholder: e.target.value })}
            placeholder="Enter placeholder text..."
          />
        </div>

        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="rounded-md border p-4 bg-muted">
            <p className="text-sm text-muted-foreground">
              {previewText || settings.placeholder}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 