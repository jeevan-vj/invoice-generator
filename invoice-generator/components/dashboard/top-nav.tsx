"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { Bell, ChevronRight, Plus, Search, Filter } from "lucide-react"
import Profile01 from "./profile-01"
import Link from "next/link"
import { ThemeToggle } from "../theme-toggle"

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function TopNav() {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Invoice Generator", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
  ]

  return (
    <nav className="px-3 sm:px-6 flex items-center justify-between bg-white dark:bg-[#0F0F12] border-b border-gray-200 dark:border-[#1F1F23] h-full">
      <div className="font-medium text-sm hidden sm:flex items-center space-x-1 truncate max-w-[300px]">
        {breadcrumbs.map((item, index) => (
          <div key={item.label} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400 mx-1" />}
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 dark:text-gray-100">{item.label}</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto sm:ml-0">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-[#1A1A1E] rounded-lg">
          <Search className="h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search invoices..."
            className="bg-transparent border-none focus:outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500"
          />
        </div>

        {/* Filter */}
        <button
          type="button"
          className="p-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-lg transition-colors"
        >
          <Filter className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* New Invoice */}
        <Link
          href="/invoices/new"
          className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Invoice</span>
        </Link>

        {/* Notifications */}
        <button
          type="button"
          className="p-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-lg transition-colors relative"
        >
          <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Image
              src="/avatar.png"
              alt="User avatar"
              width={32}
              height={32}
              className="rounded-full ring-2 ring-gray-200 dark:ring-[#2B2B30] cursor-pointer"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-[280px] sm:w-80 bg-background border-border rounded-lg shadow-lg"
          >
            <Profile01 avatar="/avatar.png" />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}

