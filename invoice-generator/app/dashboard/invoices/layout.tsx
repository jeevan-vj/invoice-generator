import React from "react"
import Sidebar from "@/components/dashboard/sidebar"

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">{children}</main>
    </div>
  )
} 