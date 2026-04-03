export type ProductCategory = 'screen' | 'battery' | 'charger' | 'accessories' | 'parts'

export type RepairStatus = 'pending' | 'in-progress' | 'completed'

export type UserRole = 'admin' | 'technician' | 'secretary'

export interface Profile {
  id: string
  email: string
  role: UserRole
  created_at: string
}

export interface Product {
  id: string
  name: string
  barcode?: string
  category: ProductCategory
  quantity: number
  cost_price: number
  sale_price: number
  min_stock: number
  supplier: string
  created_at: string
  updated_at: string
}

export interface Repair {
  id: string
  customer_name: string
  phone_model: string
  issue: string
  status: RepairStatus
  labor_cost: number
  price_charged: number
  date_in: string
  date_out: string | null
  technician_id: string | null
  total_profit: number
  created_at: string
  updated_at: string
}

export interface RepairItem {
  id: string
  repair_id: string
  product_id: string
  quantity_used: number
  cost_at_time: number
  created_at: string
}

export interface MonthlyReport {
  id: string
  month: number
  year: number
  total_revenue: number
  total_costs: number
  net_profit: number
  technician_share: number
  secretary_share: number
  owner_share: number
  status: 'open' | 'closed'
  technician_percent: number
  secretary_percent: number
  owner_percent: number
  created_at: string
}

export interface StockMovement {
  id: string
  product_id: string
  type: 'in' | 'out'
  quantity: number
  reason: string
  created_at: string
}

export interface Settings {
  key: string
  value: string
}
