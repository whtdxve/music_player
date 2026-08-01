#!/bin/bash
set -e

# Название новой миграции можно передать первым аргументом:
# ./reset-prisma.sh add_bitrate_field
MIGRATION_NAME=${1:-init}

echo "🗑  Удаляю старые миграции..."
rm -rf prisma/migrations

echo "💣 Удаляю файл базы данных SQLite (если есть)..."
# путь подставьте свой, если DATABASE_URL указывает на другое место
DB_FILE=$(grep DATABASE_URL .env | sed -E 's/.*file:(.*)".*/\1/')
if [ -f "$DB_FILE" ]; then
  rm -f "$DB_FILE"
  echo "   удалён: $DB_FILE"
fi

echo "🔄 Создаю новую миграцию по текущей schema.prisma и применяю к чистой БД..."
npx prisma migrate dev --name "$MIGRATION_NAME"

echo "🔄 Генерирую клиент призмы"
npx prisma generate

echo "🎉 Готово! База данных пересоздана с чистой историей миграций (миграция: $MIGRATION_NAME)."