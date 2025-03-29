"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  FileText,
  Plus,
  Folder,
  Send,
  DollarSign,
  Calendar,
} from "lucide-react"

const navigation = [
  { name: "All Invoices", href: "/invoices", icon: FileText },
  { name: "Create Invoice", href: "/invoices/new", icon: Plus },
  { name: "Drafts", href: "/invoices/drafts", icon: Folder },
  { name: "Sent", href: "/invoices/sent", icon: Send },
  { name: "Paid", href: "/invoices/paid", icon: DollarSign },
  { name: "Overdue", href: "/invoices/overdue", icon: Calendar },
]

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 dark:border-[#1F1F23]">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      isActive
                        ? "bg-gray-100 dark:bg-[#1F1F23] text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F1F23] hover:text-gray-900 dark:hover:text-white",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    )}
                  >
                    <item.icon
                      className={cn(
                        isActive
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-400 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white",
                        "mr-3 flex-shrink-0 h-5 w-5"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
} 