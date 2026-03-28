'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Plus, Eye } from 'lucide-react'
import type { Repair, RepairStatus } from '@/types'

const statusColors: Record<RepairStatus, 'default' | 'warning' | 'success'> = {
  'pending': 'warning',
  'in-progress': 'default',
  'completed': 'success',
}

const statusLabels: Record<RepairStatus, string> = {
  'pending': 'Pendiente',
  'in-progress': 'En Progreso',
  'completed': 'Completada',
}

export default function RepairsPage() {
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchRepairs()
  }, [])

  const fetchRepairs = async () => {
    const { data } = await supabase.from('repairs').select('*').order('created_at', { ascending: false })
    setRepairs(data || [])
    setLoading(false)
  }

  const getProfitColor = (profit: number) => {
    if (profit > 0) return 'text-green-600'
    if (profit < 0) return 'text-red-600'
    return 'text-slate-600'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Reparaciones</h1>
        <Link href="/repairs/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Nueva Reparación
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Ganancia</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {repairs.map((repair) => (
                <TableRow key={repair.id}>
                  <TableCell className="font-medium">{repair.customer_name}</TableCell>
                  <TableCell>{repair.phone_model}</TableCell>
                  <TableCell>
                    <Badge variant={statusColors[repair.status as RepairStatus]}>
                      {statusLabels[repair.status as RepairStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell>${repair.labor_cost.toFixed(2)}</TableCell>
                  <TableCell>${repair.price_charged.toFixed(2)}</TableCell>
                  <TableCell className={getProfitColor(repair.total_profit)}>
                    ${repair.total_profit.toFixed(2)}
                  </TableCell>
                  <TableCell>{new Date(repair.date_in).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell>
                    <Link href={`/repairs/${repair.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {repairs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                    No hay reparaciones
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
