'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   console.log('user', user)
  //   debugger;
  //   if (!loading && !user) {
  //     console.log('No user found, redirecting to sign in')
  //     router.push('/auth/sign-in')
  //   }
  // }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p>Welcome, {user.email}</p>
        {/* Add your dashboard content here */}
      </div>
    </div>
  )
}
