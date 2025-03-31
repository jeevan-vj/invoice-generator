"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { HelpCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface InvoiceNumberConfig {
  format: string
  prefix: string
  suffix: string
  startNumber: number
  padding: number
  includeYear: boolean
  includeMonth: boolean
  separator: string
}

interface InvoiceNumberConfigProps {
  config: InvoiceNumberConfig
  onChange: (config: InvoiceNumberConfig) => void
}

export function InvoiceNumberConfig({ config, onChange }: InvoiceNumberConfigProps) {
  const [preview, setPreview] = useState("")

  const generatePreview = () => {
    const now = new Date()
    const year = now.getFullYear().toString().slice(-2)
    const month = (now.getMonth() + 1).toString().padStart(2, "0")
    const number = config.startNumber.toString().padStart(config.padding, "0")

    let format = config.format
      .replace("dd", year)
      .replace("mm", month)
      .replace("nn", number)

    return `${config.prefix}${format}${config.suffix}`
  }

  const handleChange = (field: keyof InvoiceNumberConfig, value: any) => {
    const newConfig = { ...config, [field]: value }
    onChange(newConfig)
    setPreview(generatePreview())
  }

  return (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Format Template</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Use dd for year, mm for month, nn for number</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            value={config.format}
            onChange={(e) => handleChange("format", e.target.value)}
            placeholder="dd-mm-nn"
          />
        </div>
        <div className="space-y-2">
          <Label>Separator</Label>
          <Select
            value={config.separator}
            onValueChange={(value) => handleChange("separator", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-">Hyphen (-)</SelectItem>
              <SelectItem value="/">Forward Slash (/)</SelectItem>
              <SelectItem value=".">Period (.)</SelectItem>
              <SelectItem value="_">Underscore (_)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Prefix</Label>
          <Input
            value={config.prefix}
            onChange={(e) => handleChange("prefix", e.target.value)}
            placeholder="INV-"
          />
        </div>
        <div className="space-y-2">
          <Label>Suffix</Label>
          <Input
            value={config.suffix}
            onChange={(e) => handleChange("suffix", e.target.value)}
            placeholder=""
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Number</Label>
          <Input
            type="number"
            value={config.startNumber}
            onChange={(e) => handleChange("startNumber", parseInt(e.target.value))}
            min={1}
          />
        </div>
        <div className="space-y-2">
          <Label>Number Padding</Label>
          <Input
            type="number"
            value={config.padding}
            onChange={(e) => handleChange("padding", parseInt(e.target.value))}
            min={1}
            max={10}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            checked={config.includeYear}
            onCheckedChange={(checked) => handleChange("includeYear", checked)}
          />
          <Label>Include Year</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={config.includeMonth}
            onCheckedChange={(checked) => handleChange("includeMonth", checked)}
          />
          <Label>Include Month</Label>
        </div>
      </div>

      <div className="p-3 bg-muted rounded-lg">
        <Label>Preview</Label>
        <p className="text-lg font-mono">{preview}</p>
      </div>
    </CardContent>
  )
} 