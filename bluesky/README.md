# BlueSky - Stock Management Web Application

Sistema de gestión de inventario y reparaciones para tiendas de reparación de móviles.

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- Recharts
- Lucide React

## Requisitos Previos
- Node.js 18+
- Cuenta de Supabase

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear archivo `.env.local` con:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anon
SUPABASE_SERVICE_ROLE_KEY=tu_clave_service_role
```

4. Configurar base de datos:
Ejecutar el SQL en `supabase/seed.sql` en el editor SQL de Supabase

5. Ejecutar desarrollo:
```bash
npm run dev
```

## Estructura de Base de Datos

### Tablas
- `profiles` - Usuarios y roles
- `products` - Inventario de productos
- `repairs` - Tickets de reparación
- `repair_items` - Productos usados en reparaciones
- `monthly_reports` - Informes mensuales
- `stock_movements` - Movimientos de inventario
- `settings` - Configuración de la app

## Páginas
- `/login` - Autenticación
- `/dashboard` - Panel con estadísticas y gráficos
- `/products` - Gestión de inventario
- `/repairs` - Lista de reparaciones
- `/repairs/new` - Crear reparación
- `/repairs/[id]` - Detalle de reparación
- `/monthly` - Informes mensuales
- `/settings` - Configuración

## Funcionalidades
- CRUD de productos con alertas de stock bajo
- Gestión de reparaciones con cálculo automático de ganancia
- Distribución automática de ganancias (40% técnicos, 30% secretaría, 30% dueño)
- Exportación de informes a PDF
- Gráficos de estadísticas

## Deployment
Listo para Vercel. Configurar variables de entorno en el panel de Vercel.
