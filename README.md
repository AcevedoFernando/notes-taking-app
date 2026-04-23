# Crear el proyecto Django dentro del contenedor
docker compose run --rm api django-admin startproject core .

# Crear la aplicación de la API
docker compose run --rm api python manage.py startapp notes


/notes-taking-app
  ├── /api            # Django + DRF
  ├── /web            # Next.js
  ├── docker-compose.yml
  └── README.md