# Bolsa de Trabajos

Plataforma de empleo que conecta empresas con candidatos, con moderación
administrativa centralizada. Incluye un sitio público (búsqueda de empleos y
directorio de empresas) y tres paneles autenticados por rol: **Empresa**,
**Candidato** y **Administrador**.

## Descripción del proyecto

- **Sitio público**: landing page, buscador y listado de empleos, listado y
  perfil de empresas.
- **Panel de Empresa**: publicación y gestión de ofertas (borrador → revisión →
  publicada), seguimiento de postulantes con notas internas.
- **Panel de Candidato**: perfil profesional completo (experiencia, educación,
  certificaciones, idiomas, referencias), generación/subida de CV en PDF.
- **Panel de Administrador**: aprobación/rechazo de empresas, ofertas y CVs,
  suspensión y eliminación con reglas de seguridad, dashboard con métricas y
  gráficas.
- Autenticación con sesión por rol (RBAC) y protección de rutas a nivel de
  middleware.

Algunas secciones del sitio público (postulaciones y empleos guardados en el
panel de candidato) todavía usan datos de ejemplo (`src/lib/mock`) porque el
backend correspondiente aún no se ha construido — ver
[Próximas funcionalidades](#próximas-funcionalidades).

## Tecnologías utilizadas

| Categoría | Tecnología |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) + TypeScript |
| Base de datos | PostgreSQL + Prisma 7 (driver adapter `@prisma/adapter-pg`) |
| Autenticación | NextAuth v5 (Credentials, sesión JWT) |
| UI | Tailwind CSS v4 + Base UI (`@base-ui/react`) + shadcn CLI |
| Animación | Framer Motion |
| Formularios | React Hook Form + Zod |
| Gráficas | Recharts |
| Generación de PDF | `@react-pdf/renderer` |
| Notificaciones UI | Sonner (toasts) |
| Almacenamiento de archivos | Servicio propio, local por defecto (abstraído para migrar a la nube) |

## Requisitos

- Node.js 20.9+ (recomendado 24+)
- Docker Desktop (para PostgreSQL local)

## Instalación

```bash
npm install
cp .env.example .env
```

Completa `.env` con tus valores locales (ver [Variables de entorno](#variables-de-entorno)).
Genera un `NEXTAUTH_SECRET` propio con:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

> Nota: el puerto de Postgres en `docker-compose.yml`/`.env.example` es
> **5433** (no 5432), para no chocar con otros contenedores Postgres que
> puedan estar corriendo localmente.

## Variables de entorno

Definidas en `.env` (ver `.env.example` para la plantilla). Solo se listan los
nombres — nunca completes este archivo con valores reales en el repositorio.

| Variable | Propósito |
| --- | --- |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL |
| `NEXTAUTH_SECRET` | Clave usada por NextAuth para firmar sesiones/JWT |
| `NEXTAUTH_URL` | URL base de la aplicación |
| `STORAGE_DRIVER` | Driver de almacenamiento de archivos (`local` por defecto) |
| `STORAGE_LOCAL_ROOT` | Carpeta raíz para el driver de almacenamiento local |
| `MAX_UPLOAD_SIZE_MB` | Tamaño máximo permitido por archivo subido |
| `SEED_ADMIN_EMAIL` | Correo del usuario administrador creado por el seed |
| `SEED_ADMIN_PASSWORD` | Contraseña del usuario administrador creado por el seed |

## Cómo ejecutar el proyecto

1. Levantar PostgreSQL:

   ```bash
   docker compose up -d
   ```

2. Aplicar migraciones:

   ```bash
   npx prisma migrate dev
   ```

3. Sembrar la base de datos (crea el usuario administrador):

   ```bash
   npx prisma db seed
   ```

   Para además crear una empresa aprobada y un candidato de prueba:

   ```bash
   npx tsx prisma/seed.ts --with-test-users
   ```

4. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000).

Otros scripts disponibles: `npm run build` (build de producción),
`npm run start` (servir el build), `npm run lint` (ESLint).

### Credenciales sembradas (solo para desarrollo local)

| Rol | Email | Contraseña |
| --- | --- | --- |
| Administrador | valor de `SEED_ADMIN_EMAIL` en tu `.env` | valor de `SEED_ADMIN_PASSWORD` en tu `.env` |
| Empresa (aprobada, solo con `--with-test-users`) | `empresa.demo@bolsatrabajos.com` | `ChangeMe123!` |
| Candidato (solo con `--with-test-users`) | `candidato.demo@bolsatrabajos.com` | `ChangeMe123!` |

## Estructura de carpetas

```
prisma/            Esquema, migraciones y seed de la base de datos
storage/           Uploads privados (CVs, avatares) — no público, servido vía /api/files
public/uploads/    Assets públicos (logos de empresa)
src/
  proxy.ts                   Protección de rutas por rol (reemplaza a middleware.ts desde Next.js 16)
  auth.ts / auth.config.ts   Configuración de NextAuth
  app/
    (auth)/login/            Página pública de inicio de sesión
    (marketing)/             Sitio público: home, /empleos, /empresas
    admin/                   Panel de administrador
    empresa/                 Panel de empresa
    candidato/               Panel de candidato
    api/                     Rutas de API (NextAuth, servidor de archivos privados)
  components/
    ui/            Librería de componentes base (Base UI + Tailwind)
    marketing/     Secciones del sitio público (hero, footer, etc.)
    jobs/          Componentes de empleo compartidos (tarjeta, filtros)
    companies/     Componentes de empresa compartidos
    dashboard/     Shell de sidebar compartido por los 3 paneles autenticados
    motion/        Wrappers de Framer Motion (fade, reveal, contador animado)
    layout/        Providers globales (tema)
  lib/             Utilidades de infraestructura (prisma, permisos, auth-utils,
                   etiquetas de dominio, datos mock)
  services/        Lógica de negocio por dominio (company, job-posting,
                   candidate, cv, admin, storage, notification)
  validations/     Esquemas Zod compartidos entre cliente y servidor
  types/           Tipos globales (aumento de tipos de NextAuth)
```

> **Nota sobre la estructura**: Next.js App Router exige que las rutas vivan
> en `src/app/`, así que no se usa una carpeta `features/` separada como en
> una SPA genérica. En su lugar, cada dominio (empresa, candidato, admin) vive
> en su propia carpeta dentro de `app/`, con sus componentes y Server Actions
> junto a la página que los usa; solo lo verdaderamente compartido entre
> dominios vive en `components/`, `lib/` y `services/`.

## Convenciones de ramas

Git Flow simplificado:

- **`main`** — versión estable. Solo recibe merges desde `develop` cuando el
  build y el lint pasan.
- **`develop`** — rama principal de integración. Todo el desarrollo activo
  apunta aquí.
- **`feature/<nombre>`** — rama de corta vida creada desde `develop` para una
  funcionalidad puntual (ej. `feature/jobs`, `feature/admin`). Se fusiona a
  `develop` con `--no-ff` y se elimina inmediatamente después — no se dejan
  ramas de feature acumuladas ni se publican al remoto.

## Convenciones de commits

[Conventional Commits](https://www.conventionalcommits.org/), un cambio de
responsabilidad única por commit:

```
feat(auth): implement company authentication
feat(candidate): add resume upload
feat(admin): approval workflow
feat(home): redesign landing page
feat(company): company dashboard
feat(jobs): job listing page
feat(ui): create reusable card components
style(home): improve hero spacing
fix(upload): validate CV file types
refactor(layout): simplify dashboard structure
docs: update project documentation
```

Tipos usados: `feat`, `fix`, `style`, `refactor`, `chore`, `docs`.

## Próximas funcionalidades

- Sistema de postulaciones real (reemplazar los datos mock de "Mis
  postulaciones" y "Favoritos" en el panel de candidato por un flujo de
  aplicación real, con favoritos persistidos).
- Buscador avanzado (filtros combinados, guardado de búsquedas).
- Rediseño visual del Dashboard Administrador (mismo sidebar compartido que
  empresa/candidato).
- Bandeja de notificaciones en la UI (el modelo de datos ya existe en
  `src/services/notification`).
- Suite de pruebas automatizadas (unitarias e integración) y pipeline de
  CI/CD.
- Auditoría de seguridad y revalidación de sesión al cambiar el estado de una
  cuenta.
