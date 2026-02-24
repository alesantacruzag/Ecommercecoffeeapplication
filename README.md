# ☕ Café Colombia Premium

Aplicación web para la venta de cafés especiales de Colombia con dos roles: **Cliente** y **Caficultor (Administrador)**.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwind-css)

## 🎯 Características Principales

### 👤 Vista Cliente
- ✅ Catálogo de productos con filtros avanzados (precio, origen, tueste, calificación)
- 🛒 Carrito de compras con persistencia local
- 💳 Checkout con opciones de pago (Tarjeta + Mercado Pago)
- ⭐ Sistema de reseñas y puntuaciones
- 📦 Perfil de usuario con historial de pedidos
- 🔔 Sistema de notificaciones en tiempo real
- 🔍 Búsqueda avanzada de productos
- ❤️ Sistema de favoritos (wishlist)

### 👨‍💼 Vista Caficultor (Administrador)
- 📊 Dashboard con métricas y estadísticas en tiempo real
- ➕ CRUD completo de productos
- 📦 Gestión de inventario con alertas de stock
- 🚚 Gestión de pedidos con cambio de estados
- 📈 Panel de análisis (ventas, productos más vendidos, ingresos)
- 👥 Vista de clientes registrados
- ✉️ Envío de notificaciones a clientes
- 💬 Gestión de reseñas

## 🚀 Stack Tecnológico

- **Framework**: React 18.3 + TypeScript
- **Routing**: React Router 7 (Data Mode)
- **Estilos**: Tailwind CSS 4.0
- **UI Components**: Radix UI + Custom Components
- **Animaciones**: Motion (Framer Motion)
- **Gráficos**: Recharts
- **Iconos**: Lucide React
- **Notificaciones**: Sonner
- **Estado**: Context API + Local Storage
- **Backend**: Supabase (preparado para conexión)
- **Build Tool**: Vite 6.x

## 📦 Instalación

```bash
# Clonar el repositorio
git clone [url-del-repo]

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env
# Edita el archivo .env con tus credenciales de Supabase

# Iniciar el servidor de desarrollo
pnpm dev
```

## 🗄️ Configuración de Supabase

Ver el archivo [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) para instrucciones detalladas sobre:
- Creación de tablas
- Configuración de Row Level Security (RLS)
- Ingesta de datos de prueba
- Configuración de autenticación
- Conexión vía Antigravity MCP

## 🎨 Diseño y UX

### Paleta de Colores
- **Primario**: `#F72585` - Botones principales y elementos destacados
- **Secundario**: `#C4C4FF` - Tags de productos nuevos
- **Acento**: `#CEE90D` - Indicadores de descuentos
- **Fondo**: `#FFFFFF` / `#F9FAFB`

### Características de Diseño
- ✨ Animaciones suaves con Motion
- 📱 Mobile-first responsive design
- 🌗 Preparado para modo oscuro
- ♿ Accesibilidad mejorada
- 🎯 Feedback visual con toasts
- 🔄 PWA ready con Service Worker

## 🔑 Credenciales de Acceso Demo

### Cliente
```
Email: cliente@origen.com
Password: clienteorigen024
```

### Caficultor (Administrador)
```
Email: admin@origen.com
Password: adminorigen024
```

## 📂 Estructura del Proyecto

```
/
├── public/
│   ├── manifest.json       # PWA manifest
│   └── sw.js              # Service Worker
├── src/
│   ├── app/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── context/       # Context providers (Auth, Cart)
│   │   ├── pages/         # Páginas de la aplicación
│   │   │   ├── admin/    # Páginas del administrador
│   │   │   └── ...       # Páginas de cliente
│   │   ├── types/        # TypeScript types
│   │   ├── utils/        # Utilidades y datos mock
│   │   ├── App.tsx       # Componente raíz
│   │   └── routes.ts     # Configuración de rutas
│   ├── styles/           # Estilos globales
│   └── main.tsx          # Entry point
├── .env                  # Variables de entorno
├── index.html           # HTML principal
├── package.json         # Dependencias
├── vite.config.ts      # Configuración de Vite
├── SUPABASE_SETUP.md   # Guía de configuración de BD
└── README.md           # Este archivo
```

## 🛣️ Rutas de la Aplicación

### Públicas
- `/` - Página de inicio
- `/catalog` - Catálogo de productos
- `/product/:id` - Detalle de producto
- `/auth` - Login / Registro

### Cliente (Requiere autenticación)
- `/cart` - Carrito de compras
- `/checkout` - Proceso de pago
- `/profile` - Perfil y pedidos del usuario

### Administrador (Requiere rol CAFICULTOR)
- `/admin` - Dashboard con métricas
- `/admin/products` - Gestión de productos
- `/admin/orders` - Gestión de pedidos

## 🔒 Seguridad

- ✅ Row Level Security (RLS) configurado en Supabase
- ✅ Autenticación JWT mediante Supabase Auth
- ✅ Políticas de acceso por rol (Cliente/Caficultor)
- ✅ Validación de formularios
- ⚠️ **Nota**: Este proyecto es para demostración. No almacenar datos sensibles reales.

## 🎁 Características Bonus Implementadas

- [x] Sistema de favoritos (wishlist)
- [x] Cupones de descuento (UI preparada)
- [x] Recomendaciones de productos similares
- [x] Preparado para modo oscuro
- [x] Sistema de notificaciones reactivo
- [x] PWA (Progressive Web App)
- [x] Animaciones fluidas
- [x] Búsqueda y filtros avanzados

## 📱 PWA (Progressive Web App)

La aplicación está configurada como PWA:
- Funciona offline con Service Worker
- Instalable en dispositivos móviles
- Caché inteligente de recursos
- Manifest.json configurado

## 🧪 Datos Mock

El proyecto incluye datos mock para desarrollo en `src/app/utils/mockData.ts`:
- 3 usuarios (1 admin, 2 clientes)
- 6 productos de café
- 4 pedidos de ejemplo
- 3 reseñas
- 2 notificaciones

## 🚀 Próximos Pasos

1. **Conectar Supabase**: Sigue la guía en [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
2. **Configurar Antigravity MCP**: Para la conexión con Supabase
3. **Personalizar**: Ajusta colores, textos y productos según tus necesidades
4. **Desplegar**: Usa Vercel, Netlify o tu plataforma preferida

## 📄 Licencia

Este proyecto fue creado como demostración y está disponible bajo licencia MIT.

## 👨‍💻 Desarrollado por

Proyecto creado siguiendo las mejores prácticas de desarrollo web moderno.

---

**¿Preguntas?** Revisa la documentación en [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) o los comentarios en el código.
