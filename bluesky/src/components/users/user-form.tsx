'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface UserFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function UserForm({ onSuccess, onError }: UserFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'secretary' | 'technician'>('secretary')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user')
      }

      setEmail('')
      setPassword('')
      setRole('secretary')
      onSuccess?.()
    } catch (err) {
      onError?.(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Nuevo Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-sky-700 mb-2">
              Correo electrónico
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="touch-target"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sky-700 mb-2">
              Contraseña
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="touch-target"
              minLength={6}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-sky-700 mb-2">
              Rol
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'secretary' | 'technician')}
              className="w-full px-4 py-3 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 touch-target"
              required
            >
              <option value="secretary">Secretaria</option>
              <option value="technician">Técnico</option>
            </select>
          </div>
          <Button type="submit" className="w-full touch-target" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Usuario'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
