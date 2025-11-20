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

### Prerequisites

- Docker & Docker Compose v2+
- Node.js 20+ (for local frontend dev outside Docker)
- Python 3.11+ (optional local service dev)

### Environment Variables

Copy `.env.example` to `.env` and update secrets:

```bash
cp .env.example .env
```

Key values:

- `API_KEY_HEADER` / `API_KEY_VALUE` – backend authentication
- `GEMINI_API_KEY` / `GEMINI_MODEL_*` – primary + fallback LLMs
- `TAVILY_API_KEY`, `SERPAPI_API_KEY` – external search
- `POSTGRES_*`, `REDIS_*`, `CHROMADB_*` – infra endpoints

### Run the Stack

```bash
docker compose up --build
```

Services:

- Backend FastAPI: http://localhost:8000/api/health/ping
- AI Service: http://localhost:9000/health
- Frontend: http://localhost:3000
- Postgres: localhost:5432
- Redis: localhost:6379
- ChromaDB: localhost:8000 (REST/gRPC)

### Local Development (optional)

Backend:

```bash
cd backend
uvicorn src.main:app --reload
```

AI Service:

```bash
cd ai-service
uvicorn src.main:app --reload --port 9000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

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

