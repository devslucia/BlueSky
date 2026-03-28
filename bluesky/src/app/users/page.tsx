'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { UserForm } from '@/components/users/user-form'
import { UserList } from '@/components/users/user-list'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function UsersPage() {
  const { role, loading } = useAuth()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-sky-600">Cargando...</div>
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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-sky-800">Gestión de Usuarios</h1>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="touch-target"
        >
          {showForm ? 'Cancelar' : 'Nuevo Usuario'}
        </Button>
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
