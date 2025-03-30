"use client"

import { useState, useEffect, useRef } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { Bell, ChevronRight, Plus, Search, Filter, Menu, X, Check, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import Profile01 from "./profile-01"
import Link from "next/link"
import { ThemeToggle } from "../theme-toggle"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning"
  read: boolean
  timestamp: Date
}

export default function TopNav() {
  const { theme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Invoice Paid",
      message: "Client John Doe has paid invoice #1234",
      type: "success",
      read: false,
      timestamp: new Date(),
    },
    {
      id: "2",
      title: "Payment Overdue",
      message: "Invoice #1235 is overdue by 5 days",
      type: "warning",
      read: false,
      timestamp: new Date(),
    },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const searchRef = useRef<HTMLInputElement>(null)

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Invoice Generator", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
  ]

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      searchRef.current.focus()
    }
  }, [isSearchOpen])

  const unreadNotifications = notifications.filter(n => !n.read).length

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <>
      <nav className="px-3 sm:px-6 flex items-center justify-between bg-white dark:bg-[#0F0F12] border-b border-gray-200 dark:border-[#1F1F23] h-full">
        {/* Mobile Menu Button */}
        <button
          className="sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Breadcrumbs */}
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
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </Button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-[#1A1A1E] rounded-lg">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search invoices... (⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500"
            />
          </div>

          {/* Filter */}
          <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "p-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-lg transition-colors",
                  isFilterOpen && "bg-gray-100 dark:bg-[#1F1F23]"
                )}
              >
                <Filter className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4 space-y-4">
                <h3 className="font-medium">Filters</h3>
                <div className="space-y-2">
                  <label className="text-sm text-gray-500 dark:text-gray-400">Status</label>
                  <select className="w-full p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <option value="all">All</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-500 dark:text-gray-400">Date Range</label>
                  <div className="flex gap-2">
                    <Input type="date" className="flex-1" />
                    <Input type="date" className="flex-1" />
                  </div>
                </div>
                <Button className="w-full">Apply Filters</Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* New Invoice */}
          <Link
            href="/invoices/new"
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Invoice</span>
          </Link>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                {unreadNotifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Notifications</h3>
                  {unreadNotifications > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                    >
                      Mark all as read
                    </Button>
                  )}
                </div>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-3 rounded-lg transition-colors",
                          !notification.read && "bg-gray-50 dark:bg-[#1A1A1E]"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "p-1 rounded-full",
                            notification.type === "success" && "bg-green-100 dark:bg-green-900/30",
                            notification.type === "warning" && "bg-yellow-100 dark:bg-yellow-900/30",
                            notification.type === "info" && "bg-blue-100 dark:bg-blue-900/30"
                          )}>
                            {notification.type === "success" && <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />}
                            {notification.type === "warning" && <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />}
                            {notification.type === "info" && <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h4 className="text-sm font-medium">{notification.title}</h4>
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                              {notification.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-[#0F0F12] sm:hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#1F1F23]">
            <h2 className="text-lg font-medium">Menu</h2>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <nav className="p-4 space-y-4">
            {breadcrumbs.map((item) => (
              <Link
                key={item.label}
                href={item.href || "#"}
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Command Palette */}
      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            ref={searchRef}
            placeholder="Search invoices, clients, or settings..."
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Recent Invoices">
              <CommandItem>Invoice #1234 - John Doe</CommandItem>
              <CommandItem>Invoice #1235 - Jane Smith</CommandItem>
            </CommandGroup>
            <CommandGroup heading="Clients">
              <CommandItem>John Doe</CommandItem>
              <CommandItem>Jane Smith</CommandItem>
            </CommandGroup>
            <CommandGroup heading="Settings">
              <CommandItem>Profile Settings</CommandItem>
              <CommandItem>Notification Settings</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

