#!/bin/bash

APP_PORT=${PORT:-8000}

/opt/venv/bin/gunicorn --worker-tmp-dir /dev/shm backend.wsgi:application --bind "0.0.0.0:${APP_PORT}"

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

python manage.py flush --no-input
python manage.py migrate

exec "$@"