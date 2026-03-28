'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { ArrowLeft, CheckCircle, Clock, XCircle } from 'lucide-react'
import type { Repair, RepairItem, Product, RepairStatus } from '@/types'

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

export default function RepairDetailPage({ params }: { params: { id: string } }) {
  const [repair, setRepair] = useState<Repair | null>(null)
  const [items, setItems] = useState<(RepairItem & { product?: Product })[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchRepair()
  }, [params.id])

  const fetchRepair = async () => {
    const { data: repairData } = await supabase.from('repairs').select('*').eq('id', params.id).single()
    setRepair(repairData)

    const { data: itemsData } = await supabase.from('repair_items').select('*').eq('repair_id', params.id)
    
    if (itemsData && itemsData.length > 0) {
      const productIds = itemsData.map(i => i.product_id)
      const { data: products } = await supabase.from('products').select('*').in('id', productIds)
      
      const itemsWithProducts = itemsData.map(item => ({
        ...item,
        product: products?.find(p => p.id === item.product_id)
      }))
      setItems(itemsWithProducts)
    }

    setLoading(false)
  }

  const updateStatus = async (newStatus: RepairStatus) => {
    await supabase.from('repairs').update({
      status: newStatus,
      date_out: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : null,
    }).eq('id', params.id)

    fetchRepair()
  }

  const productsCost = items.reduce((sum, item) => sum + (item.cost_at_time * item.quantity_used), 0)

  if (loading) return <div className="p-8">Cargando...</div>
  if (!repair) return <div className="p-8">Reparación no encontrada</div>

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.push('/repairs')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver
      </Button>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reparación #{repair.id.slice(0, 8)}</h1>
          <p className="text-slate-600">{repair.customer_name} - {repair.phone_model}</p>
        </div>
        <Badge variant={statusColors[repair.status as RepairStatus]} className="text-lg px-4 py-2">
          {statusLabels[repair.status as RepairStatus]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-slate-500">Cliente</p>
              <p className="font-medium">{repair.customer_name}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Modelo</p>
              <p className="font-medium">{repair.phone_model}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Problema</p>
              <p className="font-medium">{repair.issue || 'No especificado'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información Financiera</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Costo Mano de Obra</span>
              <span className="font-medium">${repair.labor_cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Costo Productos</span>
              <span className="font-medium">${productsCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Costo Total</span>
              <span className="font-medium">${(repair.labor_cost + productsCost).toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between">
              <span className="text-slate-500">Precio Cargado</span>
              <span className="font-medium text-blue-600">${repair.price_charged.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Ganancia</span>
              <span className={`font-medium ${repair.total_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${repair.total_profit.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Productos Usados</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Costo Unitario</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product?.name || 'Producto eliminado'}</TableCell>
                  <TableCell>{item.quantity_used}</TableCell>
                  <TableCell>${item.cost_at_time.toFixed(2)}</TableCell>
                  <TableCell>${(item.cost_at_time * item.quantity_used).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-slate-500">
                    No se usaron productos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Estado de la Reparación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {repair.status !== 'pending' && (
              <Button variant="outline" onClick={() => updateStatus('pending')}>
                <Clock className="w-4 h-4 mr-2" /> Marcar Pendiente
              </Button>
            )}
            {repair.status !== 'in-progress' && (
              <Button variant="outline" onClick={() => updateStatus('in-progress')}>
                <Clock className="w-4 h-4 mr-2" /> Marcar En Progreso
              </Button>
            )}
            {repair.status !== 'completed' && (
              <Button onClick={() => updateStatus('completed')}>
                <CheckCircle className="w-4 h-4 mr-2" /> Marcar Completada
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
