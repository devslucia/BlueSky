'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    pendingRepairs: 0,
    completedRepairs: 0,
    totalRevenue: 0,
    totalCosts: 0,
    netProfit: 0,
  })
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear()

      const [productsRes, repairsRes] = await Promise.all([
        supabase.from('products').select('*'),
        supabase.from('repairs').select('*'),
      ])

      const products = productsRes.data || []
      const repairs = repairsRes.data || []

      const lowStock = products.filter(p => p.quantity < p.min_stock).length
      const pendingRepairs = repairs.filter(r => r.status === 'pending' || r.status === 'in-progress').length
      const completedRepairs = repairs.filter(r => r.status === 'completed').length

      const monthRepairs = repairs.filter((r: any) => {
        const date = new Date(r.date_in)
        return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear
      })

      const totalRevenue = monthRepairs.reduce((sum: number, r: any) => sum + (r.price_charged || 0), 0)
      const totalCosts = monthRepairs.reduce((sum: number, r: any) => sum + (r.labor_cost || 0), 0)
      const netProfit = totalRevenue - totalCosts

      setStats({
        totalProducts: products.length,
        lowStock,
        pendingRepairs,
        completedRepairs,
        totalRevenue,
        totalCosts,
        netProfit,
      })

      const last6Months = []
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const month = d.getMonth() + 1
        const year = d.getFullYear()
        const monthReps = repairs.filter((r: any) => {
          const rd = new Date(r.date_in)
          return rd.getMonth() + 1 === month && rd.getFullYear() === year
        })
        last6Months.push({
          name: d.toLocaleDateString('es-ES', { month: 'short' }),
          revenue: monthReps.reduce((s: number, r: any) => s + (r.price_charged || 0), 0),
          profit: monthReps.reduce((s: number, r: any) => s + (r.total_profit || 0), 0),
        })
      }
      setMonthlyData(last6Months)

      const categoryMap: Record<string, number> = {}
      products.forEach((p: any) => {
        categoryMap[p.category] = (categoryMap[p.category] || 0) + 1
      })
      setCategoryData(Object.entries(categoryMap).map(([name, value]) => ({ name, value })))
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { title: 'Total Productos', value: stats.totalProducts, color: 'from-blue-500 to-blue-600', icon: '📦' },
    { title: 'Stock Bajo', value: stats.lowStock, color: 'from-red-500 to-red-600', icon: '⚠️' },
    { title: 'Reparaciones Pendientes', value: stats.pendingRepairs, color: 'from-yellow-500 to-yellow-600', icon: '🔧' },
    { title: 'Completadas', value: stats.completedRepairs, color: 'from-green-500 to-green-600', icon: '✅' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Panel de Control</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white shadow-lg`}
          >
            <p className="text-sm opacity-80">{stat.title}</p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Ingresos y Ganancias (Últimos 6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#3B82F6" name="Ingresos" />
                <Bar dataKey="profit" fill="#10B981" name="Ganancia" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Ingresos del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">${stats.totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Costos del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">${stats.totalCosts.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Ganancia Neta</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">${stats.netProfit.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
