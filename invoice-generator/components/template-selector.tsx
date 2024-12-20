import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { ColorPicker } from "@/components/ui/color-picker"
import { Separator } from "@/components/ui/separator"

export type TemplateOption = "classic" | "modern" | "minimal" | "corporate"

interface TemplateTheme {
  primary: string
  secondary: string
}

interface TemplateSelectorProps {
  selected: TemplateOption
  onSelect: (template: TemplateOption) => void
  theme: TemplateTheme
  onThemeChange: (theme: TemplateTheme) => void
}

const templates = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional professional design",
    thumbnail: "🧾",
    color: "from-blue-500/20 to-blue-500/5"
  },
  {
    id: "modern",
    name: "Modern",
    description: "Contemporary gradient style",
    thumbnail: "📋",
    color: "from-purple-500/20 to-purple-500/5"
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple layout",
    thumbnail: "📝",
    color: "from-gray-500/20 to-gray-500/5"
  },
  {
    id: "corporate",
    name: "Corporate",
    description: "Business-focused template",
    thumbnail: "📊",
    color: "from-green-500/20 to-green-500/5"
  }
]

export function TemplateSelector({ 
  selected, 
  onSelect, 
  theme, 
  onThemeChange 
}: TemplateSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Choose Template</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template) => (
            <Card
              key={template.id}
              className={cn(
                "relative cursor-pointer transition-all hover:scale-105",
                "bg-gradient-to-br",
                template.color,
                selected === template.id && "ring-2",
                selected === template.id && { borderColor: theme.primary }
              )}
              onClick={() => onSelect(template.id as TemplateOption)}
              style={{
                '--theme-primary': theme.primary,
                '--theme-secondary': theme.secondary,
              } as React.CSSProperties}
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

      <div className="p-4 rounded-lg border bg-card">
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Customize Colors</h4>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ColorPicker
                color={theme.primary}
                onChange={(color) => onThemeChange({ ...theme, primary: color })}
              />
              <span className="text-sm text-muted-foreground">Primary</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <ColorPicker
                color={theme.secondary}
                onChange={(color) => onThemeChange({ ...theme, secondary: color })}
              />
              <span className="text-sm text-muted-foreground">Secondary</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
