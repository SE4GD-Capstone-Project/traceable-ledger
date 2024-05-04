#!/bin/bash

APP_PORT=${PORT:-8000}
gunicorn_cmd="/opt/venv/bin/gunicorn --worker-tmp-dir /dev/shm backend.wsgi:application --bind 0.0.0.0:${APP_PORT}"

if [ "$DATABASE" = "postgres" ]; then
    echo "Waiting for postgres..."

    while ! (echo > /dev/tcp/$SQL_HOST/$SQL_PORT) &> /dev/null; do
        sleep 0.1
    done

    echo "PostgreSQL started"
fi

/opt/venv/bin/python manage.py flush --no-input
/opt/venv/bin/python manage.py makemigrations --noinput
/opt/venv/bin/python manage.py migrate --noinput

# Start Gunicorn
exec $gunicorn_cmd
