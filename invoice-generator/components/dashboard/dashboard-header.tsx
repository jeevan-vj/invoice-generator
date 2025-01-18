'use client';

import { useAuth } from '@/contexts/auth-context'

export default function DashboardHeader() {
  const { user, signOut } = useAuth()

  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {user && (
        <div className="flex items-center gap-4">
          <span>{user.email}</span>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  )
}
