import { FileText, Plus, DollarSign, Users, Calendar, BarChart3, Settings } from "lucide-react"
import Link from "next/link"

export default function Content() {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Invoices</h3>
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
          <p className="text-sm text-green-500 mt-2">+12% from last month</p>
        </div>
        
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</h3>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">$48,250</p>
          <p className="text-sm text-green-500 mt-2">+8% from last month</p>
        </div>

        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Clients</h3>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
          <p className="text-sm text-green-500 mt-2">+5% from last month</p>
        </div>

        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Payments</h3>
            <Calendar className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
          <p className="text-sm text-red-500 mt-2">3 overdue</p>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Invoices</h2>
            <Link href="/invoices/new" className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              New Invoice
            </Link>
          </div>
          <div className="space-y-4">
            {/* Sample Invoice Items - Replace with actual data */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1A1A1E] rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">INV-2024-001</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Acme Corp</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">$2,500</p>
                <p className="text-sm text-green-500">Paid</p>
              </div>
            </div>
            {/* Add more invoice items here */}
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Analytics</h2>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#1A1A1E] rounded-lg">
              <Settings className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-[#1A1A1E] rounded-lg">
            <BarChart3 className="w-12 h-12 text-gray-400" />
            {/* Add your chart component here */}
          </div>
        </div>
      </div>
    </div>
  )
}

