#!/bin/bash

# Development Shutdown Script
# This script stops all running services

echo "🛑 Stopping Chaatu Development Environment"
echo "=========================================="

# Stop backend
if [ -f /tmp/chaatu-backend.pid ]; then
    BACKEND_PID=$(cat /tmp/chaatu-backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "🛑 Stopping backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID
        rm /tmp/chaatu-backend.pid
    fi
fi

# Stop frontend
if [ -f /tmp/chaatu-frontend.pid ]; then
    FRONTEND_PID=$(cat /tmp/chaatu-frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "🛑 Stopping frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID
        rm /tmp/chaatu-frontend.pid
    fi
fi

# Stop Docker services
echo "🛑 Stopping infrastructure services..."
docker compose down

echo ""
echo "✅ All services stopped!"
