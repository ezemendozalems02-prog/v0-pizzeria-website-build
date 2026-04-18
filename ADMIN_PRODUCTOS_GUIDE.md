# Guía Completa: Sistema de Gestión de Productos

## ✅ Funcionalidades Implementadas

### 1. **Panel de Administración de Productos**
- Acceso: `/admin/productos`
- Visualización de todos los productos en tabla clara
- Búsqueda instantánea por nombre o descripción

### 2. **Crear Nuevos Productos**
**Paso a paso:**
1. Haz click en el botón **"Nuevo producto"** (arriba a la derecha)
2. Se abrirá un modal con los campos:
   - **Nombre del Producto** (requerido) - Ej: "Pizza Margarita"
   - **Precio** - Número con decimales
   - **Descripción** - Texto largo con detalles
   - **Imagen del Producto** (requerido) - Sección de carga de archivos
   - **Mostrar en la tienda** - Checkbox para activar/desactivar

### 3. **Subir Imágenes desde tu PC**
**Tres formas de cargar:**

**Opción A: Arrastrar y soltar (Drag & Drop)**
- Arrastra un archivo de imagen desde tu explorador directamente a la zona punteada
- Automáticamente se sube a Supabase Storage

**Opción B: Click para seleccionar**
- Haz click en la zona punteada
- Se abrirá un diálogo para seleccionar archivos de tu PC
- Elige un archivo de imagen

**Opción C: Pegar URL directa**
- Si ya tienes una URL de una imagen en internet
- Pégala manualmente en el campo de entrada

**Formatos soportados:**
- PNG, JPG, JPEG, GIF, WEBP
- Máximo 10MB por archivo
- Las imágenes se guardan permanentemente en Supabase Storage

### 4. **Editar Productos Existentes**
1. Busca el producto en la tabla
2. Haz click en el icono de **lápiz** (editar)
3. Se abre el modal con los datos actuales
4. Modifica los campos que quieras
5. Haz click en **"Actualizar"**
6. Los cambios se guardan permanentemente en la DB

### 5. **Eliminar Productos**
1. En la tabla, haz click en el icono de **papelera** (eliminar)
2. Se abre un diálogo de confirmación
3. Haz click en **"Eliminar"** para confirmar
4. El producto se elimina de la base de datos

### 6. **Mostrar/Ocultar Productos**
1. En la tabla, busca la columna "Estado"
2. Haz click en la etiqueta (dice "Activo" o "Inactivo")
3. El estado se alterna instantáneamente
4. Los productos inactivos no aparecen en la tienda

## 📊 Flujo de Guardado (Persistencia)

```
Acción del Admin
    ↓
Validación de datos
    ↓
Se guardan localmente en la UI (feedback instantáneo)
    ↓
Se envían a Supabase (en background)
    ↓
Base de datos actualizada permanentemente
    ↓
Se muestra mensaje de éxito/error
    ↓
✅ Cambios reflejados en la tienda en tiempo real
```

## 🔒 Seguridad y Validaciones

- **Nombre requerido**: No puedes guardar un producto sin nombre
- **Imagen requerida**: Todos los productos necesitan una imagen
- **Validación de tipos**: Solo se aceptan archivos de imagen
- **Límite de tamaño**: Máximo 10MB por imagen
- **Almacenamiento seguro**: Las imágenes se guardan en Supabase Storage (CDN global)

## 🎯 Mensajes de Feedback

- **Verde ✓**: Operación exitosa (crear, actualizar, eliminar)
- **Rojo ⚠**: Error - ve el mensaje para detalles
- **Spinner**: La operación está en progreso
- **Checkmark**: El producto fue guardado correctamente

## 💾 Garantías de Persistencia

✅ **Todos los cambios se guardan en Supabase**
- Crear un producto: se inserta en la BD
- Editar un producto: se actualiza en la BD
- Eliminar: se elimina de la BD
- Cambiar estado: se actualiza en la BD

✅ **Las imágenes se guardan en Supabase Storage**
- URL permanente (se puede compartir)
- CDN global (acceso rápido desde cualquier lugar)
- Automáticamente optimizada

✅ **Sincronización en tiempo real**
- Todos los cambios aparecen en la tienda inmediatamente
- Si hay múltiples admins, todos ven los cambios

## 🚀 Ejemplo: Crear un Producto Paso a Paso

1. Ve a `/admin/productos`
2. Click en **"Nuevo producto"**
3. Ingresa: 
   - Nombre: "Pizza Pepperoni"
   - Precio: 850
   - Descripción: "Pizza clásica con queso mozzarella y pepperoni"
4. En la sección de Imagen:
   - Arrastra una foto desde tu PC O
   - Click para seleccionar un archivo
   - Espera a que se cargue (verás una vista previa)
5. Marca **"Mostrar en la tienda"**
6. Click en **"Crear"**
7. ¡Listo! El producto aparece en la tienda en segundos

## ⚙️ Técnica: Cómo Funciona Detrás de Escenas

### Upload de Imágenes
```
Archivo desde PC
    ↓
Se comprime y convierte a buffer
    ↓
Se envía a la API (/api/upload)
    ↓
La API la sube a Supabase Storage
    ↓
Se retorna URL pública
    ↓
URL se guarda en la tabla "products"
    ↓
✅ Imagen lista para mostrar
```

### Guardar Productos
```
Datos del formulario
    ↓
Se validan
    ↓
Se envían a Supabase
    ↓
INSERT o UPDATE en tabla "products"
    ↓
El estado local se actualiza
    ↓
✅ Cambios visibles en la UI y tienda
```

## 📝 Notas Importantes

- Los productos están conectados a **Categorías** (Pizzas, Bebidas, etc.)
- El campo **"Orden"** controla en qué posición aparecen en la tienda
- Las imágenes se redimensionan automáticamente en la tienda
- Los cambios son instantáneos pero se guardan en background

## 🆘 Troubleshooting

| Problema | Solución |
|----------|----------|
| No puedo subir imagen | Verifica que sea un archivo de imagen (PNG, JPG, GIF, WEBP) y menor a 10MB |
| La imagen no se ve | Espera a que termine de cargar, verás una vista previa |
| El producto no aparece en la tienda | Verifica que esté marcado como "Activo" en el estado |
| No se guardó el cambio | Busca el mensaje de error (en rojo) y intenta de nuevo |
| La imagen desaparece después | Los cambios están garantizados - recarga la página y verás que persiste |

---

**Sistema listo para usar. Todos los cambios se guardan permanentemente en Supabase.**
