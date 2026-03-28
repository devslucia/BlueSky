'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { UserForm } from '@/components/users/user-form'
import { UserList } from '@/components/users/user-list'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function UsersPage() {
  const { role, loading } = useAuth()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-slate-500">Cargando...</div>
      </div>
    )
  }

  if (role !== 'admin') {
    router.push('/dashboard')
    return null
  }

  const handleSuccess = () => {
    setShowForm(false)
    setRefreshKey((prev) => prev + 1)
  }

  const handleError = (error: string) => {
    alert(error)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Gestión de Usuarios</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancelar' : 'Nuevo Usuario'}
        </button>
      </div>

      {showForm && (
        <div className="max-w-md">
          <UserForm onSuccess={handleSuccess} onError={handleError} />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Usuarios Activos</CardTitle>
        </CardHeader>
        <CardContent key={refreshKey}>
          <UserList onDelete={() => setRefreshKey((prev) => prev + 1)} />
        </CardContent>
      </Card>
    </div>
  )
}
