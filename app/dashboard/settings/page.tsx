"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InvoiceNumberConfig } from "@/components/invoice-number-config"
import { InvoiceNumberConfig as InvoiceNumberConfigType } from "@/types/invoice"
import { InvoiceNumberService } from "@/lib/services/invoice-number-service"
import { useAuth } from "@/contexts/auth-context"
import { ArrowLeft } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [invoiceNumberConfig, setInvoiceNumberConfig] = useState<InvoiceNumberConfigType>({
    format: "dd-mm-nn",
    prefix: "INV-",
    suffix: "",
    startNumber: 1,
    padding: 3,
    includeYear: true,
    includeMonth: true,
    separator: "-"
  })

  useEffect(() => {
    // Load saved settings from the service
    const service = InvoiceNumberService.getInstance()
    const savedConfig = service.getConfig()
    setInvoiceNumberConfig(savedConfig)
  }, [])

  const handleSave = async () => {
    try {
      const service = InvoiceNumberService.getInstance()
      service.setConfig(invoiceNumberConfig)
      // Here you would typically also save to your backend
      // await saveSettingsToBackend(invoiceNumberConfig)
      router.push("/dashboard")
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Please sign in to access settings
          </h1>
          <Button
            variant="outline"
            onClick={() => router.push("/auth/sign-in")}
            className="flex items-center gap-2"
          >
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Business Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Configure your business-wide settings
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Number Settings</CardTitle>
            <CardDescription>
              Configure how your invoice numbers are generated. These settings will apply to all new invoices.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InvoiceNumberConfig
              config={invoiceNumberConfig}
              onChange={setInvoiceNumberConfig}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
} 