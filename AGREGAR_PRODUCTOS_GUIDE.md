# Guía: Agregar Productos y Contenido a TOTORE

## 1. PRODUCTOS — Panel de Admin

### Crear Nuevo Producto
1. Ve a `/admin/productos`
2. Haz click en el botón **"Nuevo Producto"** (rojo, arriba a la derecha)
3. Se abrirá un modal para crear:
   - **Imagen**: Arrastra la foto del producto o haz click para seleccionar
   - **Nombre**: Ej: "Pizza Jamón y Queso" (requerido)
   - **Descripción**: Ej: "Masa artesanal con jamón, queso y orégano"
   - **Precio**: Número sin símbolos
   - **Categoría**: Se asigna automáticamente a "Pizzas" (puede editarse después en DB si necesitas otra)
   - **Orden**: Número para controlar el orden en el catálogo
   - **Visible**: Activo u Oculto
4. Haz click en **"Crear Producto"**
5. El producto aparece inmediatamente en la lista y en el sitio (en tiempo real)

### Editar Producto Existente
1. Ve a `/admin/productos`
2. Haz click en el ícono de lápiz (✏️) del producto
3. Modifica los campos que necesites (imagen, precio, descripción, etc.)
4. Haz click en **"Guardar"**
5. Los cambios se reflejan en tiempo real en el sitio

### Eliminar Producto
1. Ve a `/admin/productos`
2. Haz click en la papelera (🗑️) del producto
3. Confirma la eliminación
4. El producto se elimina del catálogo

### Ocultar/Mostrar Producto
1. Ve a `/admin/productos`
2. Haz click en el ícono de ojo (👁️) del producto
3. Si el ojo está abierto = Visible | Si está cerrado = Oculto
4. El cambio es instantáneo

---

## 2. IMÁGENES — Sistema de Upload

Todos los productos usan **Supabase Storage** para guardar imágenes:

### Subir Imagen desde PC
- En el modal de crear/editar producto, verás una **zona de drag-and-drop** con ícono de nube
- **Opción 1**: Arrastra la imagen directamente a la zona
- **Opción 2**: Haz click en la zona para abrir el selector de archivos
- **Formatos soportados**: PNG, JPG, GIF, WEBP
- **Tamaño máximo**: 10 MB
- La imagen se sube automáticamente y se genera una URL permanente

### Usar URL Directa
- Si tienes una URL de imagen (de Google Drive, otra web, etc.)
- Pega la URL en el campo de texto debajo del uploader
- La URL se guardará como referencia

---

## 3. BANNERS — Gestión de Imágenes de Secciones

Los banners son imágenes especiales para diferentes secciones del sitio:

### Editar Banner
1. Ve a `/admin/banners`
2. Haz click en **"Editar"** del banner que quieras modificar
3. Sube la nueva imagen (misma interfaz que productos)
4. O pega una URL directa
5. Haz click en **"Guardar y publicar"**

### Banners Disponibles
- **Home — Principal**: Banner principal de la página de inicio
- **Sobre Nosotros**: Banner para la sección de info
- **Contacto**: Banner para la página de contacto
- **Pedido Delivery**: Banner para pedidos online
- (+ otros banners especiales)

---

## 4. FLUJO DE ACTUALIZACIÓN EN TIEMPO REAL

Todos los cambios se sincronizan automáticamente:

1. **Creación**: Subes un producto → aparece en la lista inmediatamente ✓
2. **Edición**: Cambias nombre/precio → el sitio se actualiza en vivo ✓
3. **Imagen**: Subes foto → se guarda en Supabase Storage y aparece al instante ✓
4. **Eliminación**: Borras producto → desaparece de catálogo y sitio ✓

No es necesario recargar páginas — todo funciona con WebSocket Realtime de Supabase.

---

## 5. CATEGORÍAS DE PRODUCTOS

Actualmente hay categorías preconfiguradas en la DB:

- **Pizzas** (ID: 1)
- **Bebidas** (ID: 2)
- **Postres** (ID: 3)
- **Otros** (ID: 4)

Cuando creas un producto nuevo, se asigna automáticamente a "Pizzas". 
Si necesitas cambiar la categoría, comunícate con el equipo técnico para actualizar la DB.

---

## 6. MEJORES PRÁCTICAS

✓ **Imágenes de Alta Calidad**: Usa fotos bien iluminadas y nítidas
✓ **Nombres Claros**: Ej: "Pizza Margarita" en lugar de "P. Marg"
✓ **Descripciones Breves**: Max 200 caracteres, información útil
✓ **Precios Correctos**: Revisa antes de guardar
✓ **Orden Lógico**: Número 1, 2, 3, etc. para ordenar en el catálogo
✓ **Backup de Imágenes**: Guarda copias de tus fotos en local

---

## 7. PREGUNTAS FRECUENTES

**¿Puedo agregar más categorías?**
No directamente desde el admin. Contacta al equipo técnico.

**¿Se pierden las imágenes si elimino un producto?**
La imagen permanece en Supabase Storage, pero no se referencia más.

**¿Cuántos productos puedo agregar?**
Sin límite — el sistema está diseñado para escalar.

**¿Las imágenes son públicas?**
Sí, todas las imágenes en Supabase Storage son públicas (accesibles con URL).

**¿Qué pasa si subo una imagen muy grande?**
El sistema rechaza archivos > 10MB. Comprime la imagen primero.

---

**Última actualización**: 2026-04-17
**Sistema**: TOTORE Admin Panel con Supabase Storage + Realtime
