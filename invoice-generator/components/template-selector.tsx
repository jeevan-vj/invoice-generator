import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export type TemplateOption = "classic" | "modern" | "minimal" | "corporate"

interface TemplateSelectorProps {
  selected: TemplateOption
  onSelect: (template: TemplateOption) => void
}

const templates = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional professional design",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary gradient style",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple layout",
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Business-focused template",
  },
]

export function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Choose Template</h3>
        <RadioGroup value={selected} onValueChange={(value) => onSelect(value as TemplateOption)}>
          <div className="grid grid-cols-2 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="flex items-start space-x-3">
                <RadioGroupItem value={template.id} id={template.id} />
                <Label htmlFor={template.id} className="flex flex-col">
                  <span className="font-medium">{template.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {template.description}
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
