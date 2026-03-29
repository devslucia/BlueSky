import { Sidebar } from '@/components/layout/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 min-w-0">
        <div className="md:hidden flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <div className="md:hidden h-6" />
        {children}
      </main>
    </div>
  )
}
