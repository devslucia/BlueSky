'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { LayoutDashboard, Package, Wrench, Calendar, Settings, LogOut, Users, Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Panel' },
  { href: '/products', icon: Package, label: 'Inventario' },
  { href: '/repairs', icon: Wrench, label: 'Reparaciones' },
  { href: '/monthly', icon: Calendar, label: 'Mensual' },
  { href: '/settings', icon: Settings, label: 'Ajustes' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { role, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  const NavLink = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = pathname.startsWith(item.href)
    const Icon = item.icon
    return (
      <Link
        href={item.href}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 touch-target ${
          isActive
            ? 'bg-sky-500 text-white shadow-lg shadow-sky-300/50'
            : 'text-sky-700 hover:bg-sky-100 hover:text-sky-800'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{item.label}</span>
      </Link>
    )
  }

  const SidebarContent = () => (
    <>
      <div className="p-4 md:p-6 border-b border-sky-100">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="BlueSky Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-sky-700">BlueSky</h1>
            <p className="text-xs text-sky-500 hidden md:block">Gestión de Tienda</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-3 md:p-4 space-y-1 md:space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
        {role === 'admin' && (
          <Link
            href="/users"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 touch-target ${
              pathname.startsWith('/users')
                ? 'bg-sky-500 text-white shadow-lg shadow-sky-300/50'
                : 'text-sky-700 hover:bg-sky-100 hover:text-sky-800'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">Usuarios</span>
          </Link>
        )}
      </nav>

      <div className="p-3 md:p-4 border-t border-sky-100">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-sky-700 hover:bg-sky-100 rounded-xl w-full transition-all duration-200 touch-target"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg touch-target text-sky-700"
        aria-label="Abrir menú"
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="md:hidden">
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        <aside 
          className={`fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-white to-sky-50 z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        >
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-4 right-4 p-2 text-sky-600 touch-target"
            aria-label="Cerrar menú"
          >
            <X className="w-6 h-6" />
          </button>
          <SidebarContent />
        </aside>
      </div>

      <aside className="hidden md:flex w-64 bg-gradient-to-b from-white to-sky-50 text-sky-800 min-h-screen flex-col shadow-xl shadow-sky-200/30">
        <SidebarContent />
      </aside>
    </>
  )
}
