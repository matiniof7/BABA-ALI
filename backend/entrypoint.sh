#!/bin/sh
set -e

# Load environment variables if .env exists
if [ -f /app/.env ]; then
  export $(cat /app/.env | sed 's/#.*//g' | xargs)
fi

# Apply database migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Start Gunicorn
exec gunicorn django_project.wsgi:application --bind 0.0.0.0:8000 --workers 3
