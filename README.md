Dairy Shop Digital Menu

Overview
- Next.js frontend (TypeScript)
- Django backend (DRF) for data management and admin
- PostgreSQL database
- docker-compose that runs nextjs, django, and postgres for development/production testing

Quick start
1. Copy env example and edit values:
   cp backend/.env.example backend/.env
   # Edit backend/.env and set DJANGO_SECRET_KEY and POSTGRES_PASSWORD

2. Build and run services:
   docker compose up --build -d

3. Create Django admin user:
   docker compose exec django python manage.py createsuperuser

4. Browse:
   - Frontend: http://<server>:3000
   - Django admin: http://<server>:8000/admin

Notes
- Do NOT commit sensitive files like backend/.env to git.
- For production, review CORS and DEBUG settings in backend/.env and configure a reverse proxy (nginx) and HTTPS.
