# AutoAppOrchestrator Frontend

Aplicación web construida con Next.js 14 y React.

## 📁 Estructura

```
frontend/
├── src/
│   ├── app/            # App Router de Next.js
│   │   ├── dashboard/  # Dashboard del usuario
│   │   ├── login/      # Página de login
│   │   └── ...
│   ├── components/     # Componentes reutilizables
│   ├── lib/            # Utilidades (API, Supabase, etc.)
│   ├── store/          # Estado global (Zustand)
│   └── styles/         # Estilos globales
├── public/             # Archivos estáticos
└── package.json
```

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar .env.local
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en desarrollo
npm run dev

# Abrir en navegador
# http://localhost:3000
```

## 🏗️ Build para Producción

```bash
# Crear build optimizado
npm run build

# Ejecutar build de producción
npm start
```

## 🎨 Características

- ⚡ Next.js 14 con App Router
- 🎨 Tailwind CSS para estilos
- 🔐 Autenticación con Supabase
- 📊 React Query para data fetching
- 🎭 Zustand para estado global
- 🎉 Animaciones con Framer Motion
- 🍞 Notificaciones con React Hot Toast
- 📝 TypeScript para type safety

## 🔧 Configuración

### Variables de Entorno

Crear `.env.local` con:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_stripe_public_key
```

## 📄 Páginas Principales

- `/` - Landing page
- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/dashboard` - Panel de control
- `/create` - Crear nueva app
- `/apps/[id]` - Detalles de app
- `/pricing` - Planes y precios
- `/settings` - Configuración de usuario

## 🧩 Componentes

Los componentes están en `src/components/`:
- `ui/` - Componentes de UI base
- `layout/` - Componentes de layout
- `features/` - Componentes específicos de features

## 🎯 Estado Global

Usando Zustand para:
- Auth state (`useAuthStore`)
- UI state (`useUIStore`)
- Apps state (`useAppsStore`)

```typescript
import { useAuthStore } from '@/store';

const { user, isAuthenticated } = useAuthStore();
```

## 🔌 API Client

Cliente de API en `src/lib/api.ts`:

```typescript
import { apiClient } from '@/lib/api';

// Ejemplo
const apps = await apiClient.apps.getAll();
```

## 🎨 Estilos

- Tailwind CSS con configuración personalizada
- Clases de utilidad personalizadas en `globals.css`
- Variables CSS para theming

## 🧪 Testing

```bash
npm test
```

## 📱 Responsive

Totalmente responsive con breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🚢 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel --prod
```

### Otras plataformas

```bash
npm run build
# Deploy la carpeta .next/ y public/
```

## 🐛 Troubleshooting

### Error: Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error en build
```bash
npm run lint
npm run type-check
```

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Query](https://tanstack.com/query)
