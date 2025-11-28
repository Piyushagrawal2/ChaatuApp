#!/bin/bash

# Docker Development Helper Script
# Simplifies common Docker Compose operations

set -e

PROJECT_NAME="chaatu"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

show_usage() {
    echo "🐳 Chaatu Docker Helper"
    echo ""
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  up          Start all services"
    echo "  down        Stop all services"
    echo "  restart     Restart all services"
    echo "  logs        Show logs from all services"
    echo "  logs <svc>  Show logs from specific service"
    echo "  ps          Show running services"
    echo "  build       Rebuild all images"
    echo "  clean       Remove all containers and volumes"
    echo "  backend     Open backend shell"
    echo "  db          Open PostgreSQL shell"
    echo ""
}

case "$1" in
    up)
        echo -e "${BLUE}🚀 Starting Chaatu services...${NC}"
        docker compose up -d
        echo ""
        echo -e "${GREEN}✅ Services started!${NC}"
        echo ""
        echo "📍 Access points:"
        echo "   • Frontend:  http://localhost:${FRONTEND_PORT:-3001}"
        echo "   • Backend:   http://localhost:${BACKEND_PORT:-8080}"
        echo "   • PgAdmin:   http://localhost:5050"
        echo ""
        echo "📝 View logs: ./dev.sh logs"
        ;;
    
    down)
        echo -e "${YELLOW}🛑 Stopping Chaatu services...${NC}"
        docker compose down
        echo -e "${GREEN}✅ Services stopped!${NC}"
        ;;
    
    restart)
        echo -e "${YELLOW}🔄 Restarting Chaatu services...${NC}"
        docker compose restart
        echo -e "${GREEN}✅ Services restarted!${NC}"
        ;;
    
    logs)
        if [ -z "$2" ]; then
            docker compose logs -f
        else
            docker compose logs -f "$2"
        fi
        ;;
    
    ps)
        docker compose ps
        ;;
    
    build)
        echo -e "${BLUE}🔨 Building images...${NC}"
        docker compose build
        echo -e "${GREEN}✅ Build complete!${NC}"
        ;;
    
    clean)
        echo -e "${YELLOW}🧹 Cleaning up containers and volumes...${NC}"
        docker compose down -v
        echo -e "${GREEN}✅ Cleanup complete!${NC}"
        ;;
    
    backend)
        echo -e "${BLUE}🐚 Opening backend shell...${NC}"
        docker compose exec backend /bin/bash
        ;;
    
    db)
        echo -e "${BLUE}🐚 Opening PostgreSQL shell...${NC}"
        docker compose exec postgres psql -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-chaatu}
        ;;
    
    *)
        show_usage
        ;;
esac
