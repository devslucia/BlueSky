'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Download, Lock, Unlock } from 'lucide-react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { MonthlyReport, Repair } from '@/types'

const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export default function MonthlyPage() {
  const [reports, setReports] = useState<MonthlyReport[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const supabase = createClient()

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    const { data } = await supabase.from('monthly_reports').select('*').order('year', { ascending: false }).order('month', { ascending: false })
    setReports(data || [])
    setLoading(false)
  }

  const generateReport = async () => {
    const { data: repairs } = await supabase.from('repairs').select('*')
    
    const monthRepairs = (repairs || []).filter((r: any) => {
      const date = new Date(r.date_in)
      return date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear
    })

    const totalRevenue = monthRepairs.reduce((sum: number, r: any) => sum + (r.price_charged || 0), 0)
    const totalCosts = monthRepairs.reduce((sum: number, r: any) => sum + (r.labor_cost || 0), 0)
    const netProfit = totalRevenue - totalCosts

    const technicianShare = netProfit * 0.4
    const secretaryShare = netProfit * 0.3
    const ownerShare = netProfit * 0.3

    const existingReport = reports.find(r => r.month === selectedMonth && r.year === selectedYear)

    if (existingReport) {
      await supabase.from('monthly_reports').update({
        total_revenue: totalRevenue,
        total_costs: totalCosts,
        net_profit: netProfit,
        technician_share: technicianShare,
        secretary_share: secretaryShare,
        owner_share: ownerShare,
      }).eq('id', existingReport.id)
    } else {
      await supabase.from('monthly_reports').insert({
        month: selectedMonth,
        year: selectedYear,
        total_revenue: totalRevenue,
        total_costs: totalCosts,
        net_profit: netProfit,
        technician_share: technicianShare,
        secretary_share: secretaryShare,
        owner_share: ownerShare,
        status: 'open',
        technician_percent: 40,
        secretary_percent: 30,
        owner_percent: 30,
      })
    }

    fetchReports()
  }

  const closeMonth = async (reportId: string) => {
    await supabase.from('monthly_reports').update({ status: 'closed' }).eq('id', reportId)
    fetchReports()
  }

  const exportPDF = (report: MonthlyReport) => {
    const doc = new jsPDF()
    
    doc.setFontSize(20)
    doc.text('BlueSky - Informe Mensual', 14, 22)
    
    doc.setFontSize(12)
    doc.text(`${monthNames[report.month - 1]} ${report.year}`, 14, 32)
    
    const tableData = [
      ['Ingresos Totales', `$${report.total_revenue.toFixed(2)}`],
      ['Costos Totales', `$${report.total_costs.toFixed(2)}`],
      ['Ganancia Neta', `$${report.net_profit.toFixed(2)}`],
      ['', ''],
      ['40% Técnicos', `$${report.technician_share.toFixed(2)}`],
      ['30% Secretaría', `$${report.secretary_share.toFixed(2)}`],
      ['30% Dueño', `$${report.owner_share.toFixed(2)}`],
    ]

    autoTable(doc, {
      startY: 40,
      head: [['Concepto', 'Monto']],
      body: tableData,
      theme: 'striped',
    })

    doc.save(`bluesky-informe-${monthNames[report.month - 1]}-${report.year}.pdf`)
  }

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Informes Mensuales</h1>

      <Card>
        <CardHeader>
          <CardTitle>Generar Informe</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mes</label>
            <select
              className="h-10 rounded-md border border-slate-300 px-3"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {monthNames.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Año</label>
            <select
              className="h-10 rounded-md border border-slate-300 px-3"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <Button onClick={generateReport}>Generar / Actualizar</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Informes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mes</TableHead>
                <TableHead>Ingresos</TableHead>
                <TableHead>Costos</TableHead>
                <TableHead>Ganancia</TableHead>
                <TableHead>Técnicos (40%)</TableHead>
                <TableHead>Secretaría (30%)</TableHead>
                <TableHead>Dueño (30%)</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    {monthNames[report.month - 1]} {report.year}
                  </TableCell>
                  <TableCell>${report.total_revenue.toFixed(2)}</TableCell>
                  <TableCell>${report.total_costs.toFixed(2)}</TableCell>
                  <TableCell className="text-green-600 font-medium">
                    ${report.net_profit.toFixed(2)}
                  </TableCell>
                  <TableCell>${report.technician_share.toFixed(2)}</TableCell>
                  <TableCell>${report.secretary_share.toFixed(2)}</TableCell>
                  <TableCell>${report.owner_share.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === 'closed' ? 'success' : 'warning'}>
                      {report.status === 'closed' ? 'Cerrado' : 'Abierto'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => exportPDF(report)}>
                        <Download className="w-4 h-4" />
                      </Button>
                      {report.status === 'open' && (
                        <Button size="sm" onClick={() => closeMonth(report.id)}>
                          <Lock className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                    No hay informes generados
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
