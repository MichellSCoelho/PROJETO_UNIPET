#!/bin/bash
echo "🚀 Iniciando sistema UNIPET..."

# Para processos anteriores se existirem
pkill -f "node src/app.js" 2>/dev/null
pkill -f "serve -s build" 2>/dev/null
sleep 1

# Inicia o backend
cd /home/michele/Unipet/unipet-backend
npm start &
echo "✅ Backend iniciado na porta 3001"
sleep 3

# Inicia o frontend
cd /home/michele/Unipet/unipet-frontend
serve -s build -l 3000 &
echo "✅ Frontend iniciado na porta 3000"

echo "🐾 Sistema UNIPET rodando!"
echo "📋 Acesse: http://localhost:3000"
echo "📺 Painel TV: http://localhost:3000 → Painel TV"
