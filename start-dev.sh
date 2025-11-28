#!/bin/bash

# Development Startup Script
# This script starts all services for local development

set -e  # Exit on error

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "🚀 Starting Chaatu Development Environment"
echo "=========================================="

# Check if Docker is running (for databases)
if ! docker info > /dev/null 2>&1; then
    echo "⚠️  Docker is not running. Starting databases with Docker..."
    echo "   Please start Docker Desktop and try again."
    exit 1
fi

# Start infrastructure services (postgres, redis, chromadb)
echo ""
echo "📦 Starting infrastructure services (PostgreSQL, Redis, ChromaDB)..."
docker compose up -d postgres redis chromadb
echo "⏳ Waiting for services to be ready..."
sleep 3

# Setup and start backend
echo ""
echo "🔧 Setting up backend..."
cd "$PROJECT_ROOT/backend"
chmod +x setup.sh
./setup.sh

echo ""
echo "🚀 Starting backend server..."
echo "   Backend will run at: http://localhost:8000"
source venv/bin/activate
uvicorn src.main:app --reload > /tmp/chaatu-backend.log 2>&1 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

# Setup and start frontend
echo ""
echo "🔧 Setting up frontend..."
cd "$PROJECT_ROOT/frontend"
chmod +x setup.sh
./setup.sh

echo ""
echo "🚀 Starting frontend server..."
echo "   Frontend will run at: http://localhost:3000"
npm run dev > /tmp/chaatu-frontend.log 2>&1 &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

# Save PIDs for cleanup
echo "$BACKEND_PID" > /tmp/chaatu-backend.pid
echo "$FRONTEND_PID" > /tmp/chaatu-frontend.pid

echo ""
echo "=========================================="
echo "✅ Development environment started!"
echo "=========================================="
echo ""
echo "📍 Services running at:"
echo "   • Frontend:  http://localhost:3000"
echo "   • Backend:   http://localhost:8000"
echo "   • PostgreSQL: localhost:5432"
echo "   • Redis:     localhost:6379"
echo "   • ChromaDB:  localhost:8001"
echo ""
echo "📝 Logs:"
echo "   • Backend:  tail -f /tmp/chaatu-backend.log"
echo "   • Frontend: tail -f /tmp/chaatu-frontend.log"
echo ""
echo "🛑 To stop all services, run: ./stop-dev.sh"
echo ""
