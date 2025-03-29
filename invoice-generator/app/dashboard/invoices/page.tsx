"use client"

import React, { useState } from "react"
import { Plus, Filter, LayoutGrid, List } from "lucide-react"
import Link from "next/link"
import InvoiceList from "@/components/invoices/invoice-list"
import InvoiceFilters from "@/components/invoices/invoice-filters"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InvoicesPage() {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <div className="flex items-center gap-2 border rounded-lg p-1">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <Link href="/invoices/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Invoices</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">24</p>
        </div>
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">$48,250</p>
        </div>
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">8</p>
          <p className="text-sm text-red-500 mt-2">3 overdue</p>
        </div>
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Paid</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">16</p>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23]">
          <InvoiceFilters
            onApply={(filters) => {
              console.log("Applied filters:", filters)
              setShowFilters(false)
            }}
            onReset={() => {
              console.log("Reset filters")
              setShowFilters(false)
            }}
          />
        </div>
      )}

      {/* Invoice List */}
      <div className="bg-white dark:bg-[#0F0F12] rounded-xl border border-gray-200 dark:border-[#1F1F23]">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start border-b border-gray-200 dark:border-[#1F1F23] rounded-none">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="p-0">
            <InvoiceList viewMode={viewMode} />
          </TabsContent>
          <TabsContent value="draft" className="p-0">
            <InvoiceList viewMode={viewMode} />
          </TabsContent>
          <TabsContent value="sent" className="p-0">
            <InvoiceList viewMode={viewMode} />
          </TabsContent>
          <TabsContent value="paid" className="p-0">
            <InvoiceList viewMode={viewMode} />
          </TabsContent>
          <TabsContent value="overdue" className="p-0">
            <InvoiceList viewMode={viewMode} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 