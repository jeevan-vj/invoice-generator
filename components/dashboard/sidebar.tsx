"use client"

import {
  FileText,
  Plus,
  DollarSign,
  Users,
  Calendar,
  BarChart3,
  Settings,
  HelpCircle,
  Menu,
  Receipt,
  Building2,
  CreditCard,
  Folder,
  Shield,
  MessagesSquare,
  Video,
  ChevronLeft,
} from "lucide-react"

import { Home } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Image from "next/image"

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  function handleNavigation() {
    setIsMobileMenuOpen(false)
  }

  function NavItem({
    href,
    icon: Icon,
    children,
  }: {
    href: string
    icon: any
    children: React.ReactNode
  }) {
    return (
      <Link
        href={href}
        onClick={handleNavigation}
        className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]"
      >
        <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
        {!isCollapsed && children}
      </Link>
    )
  }

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <nav
        className={`
                fixed inset-y-0 left-0 z-[70] bg-white dark:bg-[#0F0F12] transform transition-all duration-300 ease-in-out
                lg:translate-x-0 lg:static border-r border-gray-200 dark:border-[#1F1F23]
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                ${isCollapsed ? "w-20" : "w-64"}
            `}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-200 dark:border-[#1F1F23]">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Invoice Generator"
                width={32}
                height={32}
                className="flex-shrink-0 hidden dark:block"
              />
              <Image
                src="/logo-black.svg"
                alt="Invoice Generator"
                width={32}
                height={32}
                className="flex-shrink-0 block dark:hidden"
              />
              {!isCollapsed && (
                <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white">
                  Invoice Generator
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1F1F23]"
            >
              <ChevronLeft
                className={`h-5 w-5 text-gray-600 dark:text-gray-300 transition-transform duration-300 ${
                  isCollapsed ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              <div>
                {!isCollapsed && (
                  <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Invoices
                  </div>
                )}
                <div className="space-y-1">
                  <NavItem href="/dashboard/invoices" icon={FileText}>
                    All Invoices
                  </NavItem>
                  <NavItem href="/dashboard/invoices/new" icon={Plus}>
                    Create Invoice
                  </NavItem>
                  <NavItem href="/dashboard/invoices?status=draft" icon={Folder}>
                    Drafts
                  </NavItem>
                  <NavItem href="/dashboard/invoices?status=sent" icon={Receipt}>
                    Sent
                  </NavItem>
                  <NavItem href="/dashboard/invoices?status=paid" icon={DollarSign}>
                    Paid
                  </NavItem>
                </div>
              </div>

              <div>
                {!isCollapsed && (
                  <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Clients
                  </div>
                )}
                <div className="space-y-1">
                  <NavItem href="/dashboard/clients" icon={Users}>
                    All Clients
                  </NavItem>
                  <NavItem href="/dashboard/clients/new" icon={Plus}>
                    Add Client
                  </NavItem>
                  <NavItem href="/clients/import" icon={Folder}>
                    Import Clients
                  </NavItem>
                </div>
              </div>

              <div>
                {!isCollapsed && (
                  <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Business
                  </div>
                )}
                <div className="space-y-1">
                  <NavItem href="/dashboard/business/profile" icon={Building2}>
                    Business Profile
                  </NavItem>
                  <NavItem href="/business/settings" icon={Settings}>
                    Settings
                  </NavItem>
                  <NavItem href="/dashboard/templates" icon={FileText}>
                    Invoice Templates
                  </NavItem>
                </div>
              </div>

              <div>
                {!isCollapsed && (
                  <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Reports
                  </div>
                )}
                <div className="space-y-1">
                  <NavItem href="/reports/revenue" icon={BarChart3}>
                    Revenue Reports
                  </NavItem>
                  <NavItem href="/reports/clients" icon={Users}>
                    Client Reports
                  </NavItem>
                  <NavItem href="/reports/taxes" icon={Receipt}>
                    Tax Reports
                  </NavItem>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
            <div className="space-y-1">
              <NavItem href="/help" icon={HelpCircle}>
                Help Center
              </NavItem>
              <NavItem href="/support" icon={MessagesSquare}>
                Support
              </NavItem>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

