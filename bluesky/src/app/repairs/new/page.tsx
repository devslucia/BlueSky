'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Plus, Trash2, ScanBarcode } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Product } from '@/types'

interface RepairItem {
  product: Product
  quantity: number
}

export default function NewRepairPage() {
  const [formData, setFormData] = useState({
    customer_name: '',
    phone_model: '',
    issue: '',
    labor_cost: 0,
    price_charged: 0,
  })
  const [products, setProducts] = useState<Product[]>([])
  const [repairItems, setRepairItems] = useState<RepairItem[]>([])
  const [selectedProductId, setSelectedProductId] = useState('')
  const [itemQuantity, setItemQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [barcodeInput, setBarcodeInput] = useState('')
  const barcodeInputRef = useRef<HTMLInputElement>(null)
  const lastKeyTime = useRef<number>(0)
  const barcodeBuffer = useRef<string>('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('name')
    setProducts(data || [])
  }

  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentTime = Date.now()
    const timeDiff = currentTime - lastKeyTime.current
    
    if (e.key === 'Enter') {
      if (barcodeBuffer.current.length > 0) {
        processBarcode(barcodeBuffer.current)
        barcodeBuffer.current = ''
        setBarcodeInput('')
      }
      e.preventDefault()
      return
    }
    
    if (e.key.length === 1) {
      if (timeDiff < 100) {
        barcodeBuffer.current += e.key
      } else {
        barcodeBuffer.current = e.key
      }
      lastKeyTime.current = currentTime
    }
  }

  const processBarcode = async (barcode: string) => {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('barcode', barcode)
      .single()

    if (error || !product) {
      toast.error('Producto no encontrado')
      return
    }

    if (product.quantity <= 0) {
      toast.error('Producto sin stock')
      return
    }

    const existing = repairItems.find(item => item.product.id === product.id)
    const availableQty = product.quantity - (existing ? existing.quantity : 0)

    if (availableQty <= 0) {
      toast.error('Stock insuficiente')
      return
    }

    const qtyToAdd = 1
    if (existing) {
      const newQty = existing.quantity + qtyToAdd
      if (newQty > product.quantity) {
        toast.error('Stock insuficiente')
        return
      }
      setRepairItems(repairItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: newQty }
          : item
      ))
    } else {
      setRepairItems([...repairItems, { product, quantity: qtyToAdd }])
    }

    await supabase.from('products').update({
      quantity: product.quantity - qtyToAdd,
    }).eq('id', product.id)

    await supabase.from('stock_movements').insert({
      product_id: product.id,
      type: 'out',
      quantity: qtyToAdd,
      reason: `used in repair (new)`,
    })

    const updatedProducts = products.map(p => 
      p.id === product.id ? { ...p, quantity: p.quantity - qtyToAdd } : p
    )
    setProducts(updatedProducts)

    toast.success(`Agregado: ${product.name}`)
  }

  const handleBarcodeButtonClick = () => {
    barcodeInputRef.current?.focus()
  }

  const addProduct = () => {
    if (!selectedProductId) return
    const product = products.find(p => p.id === selectedProductId)
    if (!product) return

    const existing = repairItems.find(item => item.product.id === selectedProductId)
    if (existing) {
      setRepairItems(repairItems.map(item =>
        item.product.id === selectedProductId
          ? { ...item, quantity: item.quantity + itemQuantity }
          : item
      ))
    } else {
      setRepairItems([...repairItems, { product, quantity: itemQuantity }])
    }
    setSelectedProductId('')
    setItemQuantity(1)
  }

  const removeProduct = (productId: string) => {
    setRepairItems(repairItems.filter(item => item.product.id !== productId))
  }

  const calculateTotal = () => {
    const productsCost = repairItems.reduce((sum, item) => 
      sum + (item.product.cost_price * item.quantity), 0
    )
    return formData.labor_cost + productsCost
  }

  const calculateProfit = () => {
    const productsCost = repairItems.reduce((sum, item) => 
      sum + (item.product.cost_price * item.quantity), 0
    )
    return formData.price_charged - formData.labor_cost - productsCost
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const productsCost = repairItems.reduce((sum, item) => 
      sum + (item.product.cost_price * item.quantity), 0
    )
    const profit = formData.price_charged - formData.labor_cost - productsCost

    const { data: repair, error } = await supabase.from('repairs').insert({
      customer_name: formData.customer_name,
      phone_model: formData.phone_model,
      issue: formData.issue,
      labor_cost: formData.labor_cost,
      price_charged: formData.price_charged,
      date_in: new Date().toISOString().split('T')[0],
      status: 'pending',
      total_profit: profit,
    }).select().single()

    if (error) {
      alert('Error al crear reparación: ' + error.message)
      setLoading(false)
      return
    }

    for (const item of repairItems) {
      await supabase.from('repair_items').insert({
        repair_id: repair.id,
        product_id: item.product.id,
        quantity_used: item.quantity,
        cost_at_time: item.product.cost_price,
      })

      await supabase.from('products').update({
        quantity: item.product.quantity - item.quantity,
      }).eq('id', item.product.id)
    }

    router.push('/repairs')
  }

  const productOptions = [
    { value: '', label: 'Seleccionar producto...' },
    ...products.map(p => ({ value: p.id, label: `${p.name} (${p.quantity})` }))
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Nueva Reparación</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Cliente</label>
                <Input
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Modelo del Teléfono</label>
                <Input
                  value={formData.phone_model}
                  onChange={(e) => setFormData({ ...formData, phone_model: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción del Problema</label>
                <textarea
                  className="w-full h-24 rounded-md border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.issue}
                  onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Costos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Costo de Mano de Obra</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.labor_cost}
                  onChange={(e) => setFormData({ ...formData, labor_cost: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Precio a Cobrar</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price_charged}
                  onChange={(e) => setFormData({ ...formData, price_charged: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">Costo Total: <span className="font-bold">${calculateTotal().toFixed(2)}</span></p>
                <p className="text-sm text-slate-600">Ganancia Estimada: <span className="font-bold text-green-600">${calculateProfit().toFixed(2)}</span></p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Productos Usados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Input
                  ref={barcodeInputRef}
                  value={barcodeInput}
                  onChange={(e) => {
                    setBarcodeInput(e.target.value)
                    handleBarcodeKeyDown(e as unknown as React.KeyboardEvent<HTMLInputElement>)
                  }}
                  onKeyDown={handleBarcodeKeyDown}
                  placeholder="Escanear código de barras..."
                />
              </div>
              <Button type="button" variant="outline" onClick={handleBarcodeButtonClick}>
                <ScanBarcode className="w-4 h-4" />
              </Button>
              <Select
                options={productOptions}
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                min="1"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                className="w-24"
              />
              <Button type="button" onClick={addProduct}>
                <Plus className="w-4 h-4 mr-2" /> Agregar
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Costo Unitario</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repairItems.map((item) => (
                  <TableRow key={item.product.id}>
                    <TableCell>{item.product.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.product.cost_price.toFixed(2)}</TableCell>
                    <TableCell>${(item.product.cost_price * item.quantity).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="danger" onClick={() => removeProduct(item.product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {repairItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-slate-500">
                      No hay productos agregados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex gap-4 mt-6">
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Reparación'}
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.push('/repairs')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
