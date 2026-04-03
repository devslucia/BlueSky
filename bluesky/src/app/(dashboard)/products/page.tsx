'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Plus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react'
import type { Product, ProductCategory } from '@/types'

const categories = [
  { value: '', label: 'Todas las categorías' },
  { value: 'screen', label: 'Pantallas' },
  { value: 'battery', label: 'Baterías' },
  { value: 'charger', label: 'Cargadores' },
  { value: 'accessories', label: 'Accesorios' },
  { value: 'parts', label: 'Repuestos' },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    category: 'screen' as ProductCategory,
    quantity: 0,
    cost_price: 0,
    sale_price: 0,
    min_stock: 5,
    supplier: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [search, categoryFilter])

  const fetchProducts = async () => {
    setLoading(true)
    let query = supabase.from('products').select('*').order('name')
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,barcode.ilike.%${search}%`)
    }
    if (categoryFilter) {
      query = query.eq('category', categoryFilter)
    }

    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingProduct) {
      await supabase.from('products').update({
        ...formData,
        updated_at: new Date().toISOString(),
      }).eq('id', editingProduct.id)
    } else {
      await supabase.from('products').insert(formData)
    }

    setShowForm(false)
    setEditingProduct(null)
    setFormData({
      name: '',
      barcode: '',
      category: 'screen',
      quantity: 0,
      cost_price: 0,
      sale_price: 0,
      min_stock: 5,
      supplier: '',
    })
    fetchProducts()
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      barcode: product.barcode || '',
      category: product.category,
      quantity: product.quantity,
      cost_price: product.cost_price,
      sale_price: product.sale_price,
      min_stock: product.min_stock,
      supplier: product.supplier || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar producto?')) {
      await supabase.from('products').delete().eq('id', id)
      fetchProducts()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Inventario</h1>
        <Button onClick={() => { setShowForm(true); setEditingProduct(null); setFormData({
          name: '', barcode: '', category: 'screen', quantity: 0, cost_price: 0, sale_price: 0, min_stock: 5, supplier: ''
        })}}>
          <Plus className="w-4 h-4 mr-2" /> Nuevo Producto
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <Input
            className="pl-10"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          options={categories}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-48"
        />
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? 'Editar' : 'Nuevo'} Producto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Código de Barras</label>
                <Input
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  placeholder="Escanear o escribir código"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                <Select
                  options={categories.slice(1)}
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad</label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Stock Mínimo</label>
                <Input
                  type="number"
                  value={formData.min_stock}
                  onChange={(e) => setFormData({ ...formData, min_stock: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Precio Costo</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.cost_price}
                  onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Precio Venta</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.sale_price}
                  onChange={(e) => setFormData({ ...formData, sale_price: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Proveedor</label>
                <Input
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button type="submit">{editingProduct ? 'Guardar' : 'Crear'}</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
              <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Barcode</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Costo</TableHead>
                <TableHead>Venta</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="font-mono text-sm">{product.barcode || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {product.quantity < product.min_stock && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={product.quantity < product.min_stock ? 'text-red-600 font-bold' : ''}>
                        {product.quantity}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>${product.cost_price.toFixed(2)}</TableCell>
                  <TableCell>${product.sale_price.toFixed(2)}</TableCell>
                  <TableCell>{product.supplier}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(product.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
                {products.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                      No hay productos
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
