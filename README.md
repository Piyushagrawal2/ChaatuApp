# Chaatu Conversational AI Platform

Production-ready multi-service stack for a LangChain/LangGraph powered conversational AI assistant with RAG, memory, search, and streaming capabilities.

## Phase Roadmap

1. **Phase 1 – Foundations (current)**
   - Repository structure, Docker Compose orchestration
   - Base FastAPI backend (health endpoint, API key scaffolding)
   - AI microservice scaffold (FastAPI, config)
   - Next.js frontend placeholder with dev Dockerfile
2. **Phase 2 – AI Core**
   - LangChain/LangGraph orchestration graph, Gemini + fallback LLM wiring
   - Tool routing stubs and structured logging
3. **Phase 3 – RAG Pipeline**
   - Document ingestion API, chunking, embeddings, ChromaDB integration
4. **Phase 4 – Web Search**
   - Tavily/SerpAPI wrapper, citation tracking, caching
5. **Phase 5 – Memory System**
   - Short/long-term memory stores, summarization, entity extraction
6. **Phase 6 – Frontend UX**
   - Chat UI, document upload, settings, theme support, WebSocket streaming
7. **Phase 7 – Integration & Testing**
   - Multi-service integration, contract tests, load testing
8. **Phase 8 – Documentation & Deployment**
   - Architecture diagrams, ops guide, CI/CD pipeline, AWS IaC planning

## Architecture Overview

```
docker-compose.yml
├── ai-service (FastAPI + LangChain/LangGraph)
├── backend    (FastAPI API gateway, Postgres/Redis clients)
├── frontend   (Next.js UI)
├── chromadb   (vector store)
├── postgres   (long-term data)
└── redis      (cache/memory)
```

Shared schemas/constants are mounted into both Python services for consistent models.

## Getting Started

You have **two options** for running the project:

### Option 1: Quick Dev Scripts (Recommended for Daily Development) ⚡

Perfect for active development with fast startup and easy debugging.

**Prerequisites:**
- Docker Desktop (for databases)
- Python 3.11+
- Node.js 20+

**Start Everything:**
```bash
./start-dev.sh
```

This single command will:
- Start infrastructure (PostgreSQL, Redis, ChromaDB) via Docker
- Set up backend dependencies automatically
- Start backend server at http://localhost:8000
- Set up frontend dependencies automatically
- Start frontend at http://localhost:3000

**Stop Everything:**
```bash
./stop-dev.sh
```

**View Logs:**
```bash
# Backend logs
tail -f /tmp/chaatu-backend.log

# Frontend logs
tail -f /tmp/chaatu-frontend.log
```

---

### Option 2: Full Docker Stack (Production-like Environment) 🐳

Best for testing the complete stack or ensuring consistency across environments.

**Prerequisites:**
- Docker & Docker Compose v2+

**Environment Variables:**

Copy `.env.example` to `.env` and update secrets:
```bash
cp .env.example .env
```

**Quick Commands:**

```bash
# Start all services
./dev.sh up

# Stop all services
./dev.sh down

# View logs
./dev.sh logs

# View specific service logs
./dev.sh logs backend

# Restart services
./dev.sh restart

# Rebuild images
./dev.sh build

# Clean up everything
./dev.sh clean
```

**Manual Docker Compose:**
```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs
docker compose logs -f
```

---

## Service Endpoints

Once running, access the services at:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Backend Docs**: http://localhost:8000/docs
- **PgAdmin**: http://localhost:5050 (admin@chaatu.ai / admin123)
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **ChromaDB**: localhost:8001

---

## Development Workflow

### Making Code Changes

**Backend changes:**
- Files are watched automatically with `--reload`
- Server restarts on save

**Frontend changes:**
- Next.js hot reload is active
- Changes appear immediately in browser

### Adding Dependencies

**Backend:**
```bash
cd backend
source venv/bin/activate
pip install <package>
pip freeze > requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install <package>
```

### Database Operations

**Access PostgreSQL:**
```bash
# With Docker
./dev.sh db

# Or manually
docker compose exec postgres psql -U postgres -d chaatu
```

**View with PgAdmin:**
- Open http://localhost:5050
- Login: admin@chaatu.ai / admin123

---

## Troubleshooting

### Backend won't start

```bash
# Reinstall dependencies
cd backend
./setup.sh
```

### Frontend won't start

```bash
# Reinstall dependencies
cd frontend
./setup.sh
```

### Port already in use

```bash
# Check what's using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

### Docker issues

```bash
# Clean up and restart
./dev.sh clean
./dev.sh up
```

### Reset everything

```bash
# Stop all services
./stop-dev.sh

# Clean Docker
./dev.sh clean

# Remove virtual environments
rm -rf backend/venv frontend/node_modules

# Start fresh
./start-dev.sh
```

---

## Testing

Phase 1 provides scaffolding only. Future phases will include:

- Pytest suites for backend/ai-service (`backend/tests`, `ai-service/tests`)
- Playwright / Cypress for frontend
- Integration tests via docker-compose profiles

## Next Steps

- Implement LangGraph agent graph and tool router (Phase 2)
- Flesh out backend chat/document routes with persistence
- Build RAG ingestion pipeline with PDF/DOC priority
- Implement WebSocket streaming to frontend

