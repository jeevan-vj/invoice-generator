"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { X } from "lucide-react"

interface InvoiceFiltersProps {
  onApply: (filters: any) => void
  onReset: () => void
}

export default function InvoiceFilters({ onApply, onReset }: InvoiceFiltersProps) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>()
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 10000])
  const [status, setStatus] = useState<string>("all")
  const [client, setClient] = useState<string>("")
  const [showOverdueOnly, setShowOverdueOnly] = useState(false)

  const handleApply = () => {
    onApply({
      dateRange,
      amountRange,
      status,
      client,
      showOverdueOnly,
    })
  }

  const handleReset = () => {
    setDateRange(undefined)
    setAmountRange([0, 10000])
    setStatus("all")
    setClient("")
    setShowOverdueOnly(false)
    onReset()
  }

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <X className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        {/* Date Range */}
        <div className="space-y-2">
          <Label>Date Range</Label>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            className="w-full"
          />
        </div>

        {/* Amount Range */}
        <div className="space-y-2">
          <Label>Amount Range</Label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={amountRange[0]}
              onChange={(e) => setAmountRange([Number(e.target.value), amountRange[1]])}
              className="w-24"
              placeholder="Min"
            />
            <span className="text-gray-500">to</span>
            <Input
              type="number"
              value={amountRange[1]}
              onChange={(e) => setAmountRange([amountRange[0], Number(e.target.value)])}
              className="w-24"
              placeholder="Max"
            />
          </div>
          <Slider
            value={amountRange}
            onValueChange={setAmountRange}
            min={0}
            max={10000}
            step={100}
            className="w-full"
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Client */}
        <div className="space-y-2">
          <Label>Client</Label>
          <Input
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Search client..."
          />
        </div>

        {/* Overdue Only */}
        <div className="flex items-center justify-between">
          <Label>Show Overdue Only</Label>
          <Switch
            checked={showOverdueOnly}
            onCheckedChange={setShowOverdueOnly}
          />
        </div>
      </div>

      <Button onClick={handleApply} className="w-full">
        Apply Filters
      </Button>
    </div>
  )
} 