'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface Settings {
  technician_percent: number
  secretary_percent: number
  owner_percent: number
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    technician_percent: 40,
    secretary_percent: 30,
    owner_percent: 30,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const { data } = await supabase.from('settings').select('*').in('key', ['technician_percent', 'secretary_percent', 'owner_percent'])
    
    if (data && data.length > 0) {
      const settingsMap: Record<string, number> = {}
      data.forEach((s: any) => {
        settingsMap[s.key] = parseFloat(s.value)
      })
      setSettings({
        technician_percent: settingsMap['technician_percent'] || 40,
        secretary_percent: settingsMap['secretary_percent'] || 30,
        owner_percent: settingsMap['owner_percent'] || 30,
      })
    }
    setLoading(false)
  }

  const saveSettings = async () => {
    setSaving(true)
    
    const total = settings.technician_percent + settings.secretary_percent + settings.owner_percent
    if (total !== 100) {
      setMessage('La suma de los porcentajes debe ser 100%')
      setSaving(false)
      return
    }

    const updates = [
      { key: 'technician_percent', value: settings.technician_percent.toString() },
      { key: 'secretary_percent', value: settings.secretary_percent.toString() },
      { key: 'owner_percent', value: settings.owner_percent.toString() },
    ]

    for (const update of updates) {
      const { error } = await supabase.from('settings').upsert({
        key: update.key,
        value: update.value,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' })
      
      if (error) {
        console.error('Error saving setting:', error)
      }
    }

    setMessage('Configuración guardada correctamente')
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Configuración</h1>

      <Card>
        <CardHeader>
          <CardTitle>Distribución de Ganancias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Porcentaje Técnicos (Reparaciones)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                max="100"
                value={settings.technician_percent}
                onChange={(e) => setSettings({ ...settings, technician_percent: parseInt(e.target.value) || 0 })}
                className="w-24"
              />
              <span className="text-slate-600">%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Porcentaje Secretaría (Admin)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                max="100"
                value={settings.secretary_percent}
                onChange={(e) => setSettings({ ...settings, secretary_percent: parseInt(e.target.value) || 0 })}
                className="w-24"
              />
              <span className="text-slate-600">%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Porcentaje Dueño (Negocio)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                max="100"
                value={settings.owner_percent}
                onChange={(e) => setSettings({ ...settings, owner_percent: parseInt(e.target.value) || 0 })}
                className="w-24"
              />
              <span className="text-slate-600">%</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-slate-600">
              Total: <span className={`font-bold ${settings.technician_percent + settings.secretary_percent + settings.owner_percent === 100 ? 'text-green-600' : 'text-red-600'}`}>
                {settings.technician_percent + settings.secretary_percent + settings.owner_percent}%
              </span>
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded-lg ${message.includes('correctamente') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {message}
            </div>
          )}

          <Button onClick={saveSettings} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acerca de BlueSky</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">BlueSky v1.0.0</p>
          <p className="text-sm text-slate-500 mt-2">Sistema de gestión de inventario y reparaciones para tiendas de móviles.</p>
        </CardContent>
      </Card>
    </div>
  )
}
