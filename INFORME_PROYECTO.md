# Informe Completo del Proyecto: Notes Taking App

## Resumen Ejecutivo
El proyecto "Notes Taking App" es una plataforma completa para la toma de notas basada en una arquitectura cliente-servidor. El proyecto se divide estructuralmente en dos partes fundamentales:
1. **API (Backend):** Desarrollado con Python 3.12+ y Django Rest Framework (DRF).
2. **Web (Frontend):** Desarrollado con Next.js 14+ (App Router), Tailwind CSS y React.

Todo el entorno se encuentra empaquetado y orquestado localmente mediante Docker Compose, lo que garantiza uniformidad y portabilidad.

---

## Funcionalidad

### 1. Backend (API)
La API expone los endpoints que alimentan la interfaz, construida siguiendo estrictos estándares RESTful. Sus capacidades clave incluyen:
- **Autenticación sin estado:** Uso de JSON Web Tokens (JWT) mediante `djangorestframework-simplejwt`. Soporta registro, generación, rotación y revocación de tokens.
- **Gestión Avanzada de Notas y Categorías:**
  - Las notas soportan HTML sanitizado para texto enriquecido (utilizando la librería `bleach` para prevenir XSS).
  - Cada entidad (Nota o Usuario) se identifica internamente con `UUID4` por cuestiones de seguridad.
  - Validación de propiedad (IDOR): El sistema restringe el acceso de forma que un usuario únicamente pueda visualizar y manipular su propia información.
- **Flujo de Onboarding Automático:** Al completarse un registro nuevo, el backend entra en una transacción de base de datos para generar 4 categorías predeterminadas (Random Thoughts, School, Personal, Drama) asociadas al nuevo usuario.
- **Documentación Viva:** Implementación de OpenAPI 3.0, lo que permite visualizar los endpoints activos y esquemas desde `/api/schema/swagger-ui/`.

### 2. Frontend (Web)
La aplicación web provee una interfaz de usuario visualmente atractiva, basándose fuertemente en un sistema de tokens de diseño ("Notes Flow").
- **Flujos de Autenticación y Bienvenida:** Pantallas interactivas para Iniciar Sesión (`/auth/login`) y Registrarse (`/auth/sign-up`).
- **Dashboard de Usuario (`/home`):**
  - Un panel lateral que permite filtrar notas en tiempo real a través de las categorías creadas por el usuario.
  - El panel principal muestra un diseño en cuadrícula (grid de 3 columnas) con las notas de usuario renderizadas simulando tarjetas.
- **Diseño Atómico e Interfaz Reactiva:** 
  - La interfaz asigna dinámicamente propiedades CSS (como color de bordes y fondo al 50% de opacidad) basándose en el color hexadecimal de la categoría seleccionada por cada nota.
  - Uso de animaciones sutiles e iconos modernos utilizando `lucide-react`.

---

## Estructura del Proyecto

El sistema está organizado en una estructura monorepo conteniendo los recursos para ambos ecosistemas:

```text
/notes-taking-app
  ├── /api                     # Código fuente de la API (Backend - Django)
  │     ├── /core              # Configuraciones de Django (settings, asgi, wsgi)
  │     ├── /notes             # App Django responsable de Notas y Categorías
  │     ├── /users             # App Django responsable de la Autenticación
  │     ├── /services          # Lógica de negocio (aislada de vistas y serializadores)
  │     ├── /tests             # Entorno de pruebas (pytest, factories)
  │     ├── Dockerfile         # Imagen para la construcción del contenedor Python
  │     ├── requirements.txt   # Listado de dependencias de Backend
  │     ├── manage.py          # Script de administración nativo de Django
  │     └── CONTEXT.md         # Documentación detallada de arquitectura Backend
  │
  ├── /web                     # Código fuente de la Web (Frontend - Next.js)
  │     ├── /src               # Directorio base de Next.js (App Router, componentes, hooks)
  │     ├── /public            # Imágenes e iconos estáticos
  │     ├── /e2e               # Pruebas integrales de flujo (Playwright)
  │     ├── /.storybook        # Configuración para Component-Driven Development
  │     ├── Dockerfile         # Imagen para la construcción del contenedor Node/Next
  │     ├── package.json       # Configuración del paquete y dependencias de NPM
  │     └── CONTEXT.md         # Documentación detallada de diseño Web
  │
  ├── docker-compose.yml       # Orquestador general (levanta Frontend, Backend y PostgreSQL)
  └── README.md                # Referencia inicial del proyecto
```

---

## Guía de Inicio Local

Ejecutar el proyecto en cualquier máquina es sencillo gracias a la implementación nativa de Docker. El sistema instanciará 3 servicios: `db` (PostgreSQL), `api` y `web`.

### Prerrequisitos
- Instalar Docker Desktop y tener la capacidad de ejecutar `docker compose`.

### Instrucciones

1. **Configuración de Variables de Entorno:**
   Para ambos entornos (`/api` y `/web`), encontrarás archivos de ejemplo para el entorno llamados `.env.example`. Copia estos archivos y renómbralos a `.env`:
   - Dentro de `/api`: `cp .env.example .env`
   - Dentro de `/web`: `cp .env.example .env`

2. **Levantar los Contenedores:**
   Regresa a la raíz del proyecto (`/notes-taking-app`) y construye los contenedores con:
   ```bash
   docker compose up --build
   ```

3. **Migrar la Base de Datos:**
   Solo si es la primera ejecución, es necesario sincronizar el esquema de PostgreSQL de la API:
   ```bash
   docker compose run --rm api python manage.py migrate
   ```

4. **Acceder a los Servicios:**
   Una vez iniciados los contenedores sin errores, tendrás acceso a:
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **Backend API:** [http://localhost:8000](http://localhost:8000)
   - **Swagger (Documentación):** [http://localhost:8000/api/schema/swagger-ui/](http://localhost:8000/api/schema/swagger-ui/)

---

## Información Relevante Adicional

- **Control de Calidad (Testing):**
  - **Web:** Utiliza **Storybook** para desarrollar los componentes visuales de manera aislada (Component-Driven Development), **Vitest** para tests unitarios y **Playwright** para verificar los flujos completos del usuario.
  - **API:** Se persigue una cobertura superior al 90%. Se utiliza `pytest-django`, herramientas generadoras de datos falsos como `factory_boy`/`Faker`, e incluso pruebas basadas en propiedades (Property-Based Testing) para validar el esquema OpenAPI con `Schemathesis`.
- **Capa de Servicios de Django:** Un punto crítico de la arquitectura es que la lógica de negocio (como crear un usuario y encadenar la creación de sus 4 categorías) **no** debe residir en las vistas ni en los serializadores. Esta lógica debe ir dentro del directorio `/api/services/`.
- **Gestión de Paquetes Web:** El frontend usa la herramienta `pnpm` en lugar de `npm` o `yarn` estándar (evidenciado por el archivo `pnpm-lock.yaml`). Cuando necesites instalar paquetes, prefiere `pnpm install <paquete>`.
