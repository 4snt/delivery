#!/bin/bash

# Este projeto agora roda somente com PostgreSQL. Evite SQLite.
echo "⚠️  Este script foi descontinuado. Use PostgreSQL via docker-compose ou um servidor local."
echo "Comandos sugeridos:"
echo "  1) docker-compose up -d"
echo "  2) pnpm prisma generate"
echo "  3) pnpm prisma migrate deploy"
echo "  4) pnpm prisma db seed"
echo "  5) pnpm dev"
exit 1
