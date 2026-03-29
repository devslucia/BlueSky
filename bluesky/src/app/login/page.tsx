'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_active')
        .eq('id', data.user.id)
        .single()

      if (profile && !profile.is_active) {
        await supabase.auth.signOut()
        setError('Tu cuenta ha sido desactivada. Contacta al administrador.')
        setLoading(false)
        return
      }
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-cloud-100 to-sky-100 dark:from-navy-100 dark:via-navy-100 dark:to-navy-100" />
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-sky-200/20 to-transparent dark:from-sky-500/10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-300/10 dark:bg-sky-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sky-200/10 dark:bg-sky-500/5 rounded-full blur-3xl" />
      
      <Card className="w-full max-w-md relative z-10 shadow-2xl shadow-sky-200/50 dark:shadow-navy-300/30 border-sky-100 dark:border-navy-200">
        <CardHeader className="text-center pb-2">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src="/logo.png"
              alt="BlueSky Logo"
              fill
              className="object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-sky-700 dark:text-sky-300">Iniciar Sesión</CardTitle>
          <p className="text-sky-500 dark:text-sky-400 text-sm mt-1">Sistema de Gestión de Tienda</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-100 dark:border-red-800">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-sky-700 dark:text-sky-300 mb-2">
                Correo electrónico
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="touch-target h-12"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-sky-700 dark:text-sky-300 mb-2">
                Contraseña
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="touch-target h-12"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full touch-target h-12 text-base font-semibold bg-sky-500 hover:bg-sky-600 shadow-lg shadow-sky-300/30 dark:shadow-sky-500/20" 
              disabled={loading}
            >
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
