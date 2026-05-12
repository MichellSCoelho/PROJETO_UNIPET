#!/bin/bash
DATA=$(date +%Y-%m-%d_%H-%M)
ARQUIVO=~/Unipet/backups/unipet_backup_$DATA.sql
pg_dump -U postgres unipet_db > $ARQUIVO
echo "✅ Backup salvo em: $ARQUIVO"

# Mantém apenas os últimos 30 backups
cd ~/Unipet/backups
ls -t | tail -n +31 | xargs -r rm
