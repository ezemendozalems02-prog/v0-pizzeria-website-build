# TOTORE Pizzería - Panel de Administración con Supabase

## Estado Actual

✅ **Completado:**
- Supabase integrado en el proyecto
- Tablas de base de datos creadas (productos, categorías, banners, contenido, configuración)
- Datos iniciales insertados
- Autenticación Supabase configurada
- Middleware para proteger rutas
- Login page actualizada para usar Supabase
- Admin shell actualizado con autenticación real
- Dashboard actualizado para leer de Supabase

⚠️ **Pendiente:**
- Crear usuario admin en Supabase
- Actualizar páginas admin (productos, categorías, banners, contenido, config) para usar Supabase
- Conectar DeliveryCatalog para leer productos de Supabase en tiempo real

## Pasos para Completar

### 1. Crear Usuario Admin

Tienes dos opciones:

**Opción A: Usar el script (Recomendado)**
```bash
cd /vercel/share/v0-project
node scripts/seed-admin.js
```

Esto creará:
- Email: `admin@totore.com`
- Contraseña: `admin123456`

**Opción B: Crear manualmente en Supabase**
1. Ve a tu proyecto Supabase
2. Ve a Authentication > Users
3. Haz click en "Add user"
4. Email: `admin@totore.com`
5. Password: `admin123456`
6. Marca "Auto Confirm User"
7. Crea el usuario

### 2. Acceder al Panel

1. Navega a `/admin`
2. Si no estás logueado, irás a `/admin/login`
3. Ingresa:
   - Email: `admin@totore.com`
   - Contraseña: `admin123456`

### 3. Actualizar Páginas Admin para Supabase

Las páginas admin actual todavía usan el store en memoria. Para completar la migración a Supabase:

**Archivos a actualizar:**
- `/app/admin/productos/page.tsx` - Usar `supabase.from('products')`
- `/app/admin/categorias/page.tsx` - Usar `supabase.from('categories')`
- `/app/admin/banners/page.tsx` - Usar `supabase.from('banners')`
- `/app/admin/contenido/page.tsx` - Usar `supabase.from('content')`
- `/app/admin/configuracion/page.tsx` - Usar `supabase.from('config')`

Patrón a seguir en cada página:

```typescript
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = await createClient()
      const { data, error } = await supabase.from('products').select('*')
      if (!error) setData(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  // Resto del componente...
}
```

### 4. Usar Query Helper

En `/lib/supabase/queries.ts` están todas las funciones para interactuar con Supabase:

```typescript
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getBanners,
  getContent,
  getConfig,
} from '@/lib/supabase/queries'
```

### 5. Conectar DeliveryCatalog

El catálogo de delivery ya está preparado para leer del store. Para conectarlo a Supabase:

En `/components/delivery-catalog.tsx`, cambia:
```typescript
// De:
const { products: storeProducts } = useStore()

// A:
const [products, setProducts] = useState([])
useEffect(() => {
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('*').eq('active', true)
  setProducts(data || [])
}, [])
```

## Estructura de Base de Datos

```
products
  - id (uuid)
  - name, description, price
  - category (pizzas/bebidas)
  - image (url)
  - active (boolean)
  - created_at, updated_at

categories
  - id (uuid)
  - name, label
  - order (integer)

banners
  - id (uuid, primary key: hero/favoritas/promos)
  - image_url
  - overlay_text, overlay_position, overlay_opacity

content
  - id (default: 1)
  - home_badge, home_title, home_subtitle
  - experience_cards (json)

config
  - id (default: 1)
  - whatsapp_number, address, hours
  - instagram, footer_text

```

## Variables de Entorno

Asegúrate que están configuradas:
- `NEXT_PUBLIC_SUPABASE_URL` - Tu URL de Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Tu clave anon
- `SUPABASE_SERVICE_ROLE_KEY` - Tu clave de servicio (solo para scripts)

## Próximos Pasos Recomendados

1. ✅ Ejecutar seed script para crear admin user
2. ✅ Probar login en `/admin/login`
3. ⏳ Actualizar páginas admin para usar Supabase CRUD
4. ⏳ Probar que los cambios en admin se reflejen en el sitio público
5. ⏳ Migrar productos estáticos a base de datos

## Soporte

Si tienes dudas:
- Revisa los archivos en `/lib/supabase/queries.ts` para ejemplos de CRUD
- Consulta la documentación de Supabase: https://supabase.com/docs
- El patrón `createClient()` se usa para obtener el cliente Supabase
