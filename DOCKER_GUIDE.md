# 🐳 Docker Workflow Guide for Chaatu

## Current Status

✅ **Your Docker setup is running perfectly!**

All services are UP and accessible:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8080
- **Backend Docs**: http://localhost:8080/docs
- **AI Service**: http://localhost:9000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **ChromaDB**: localhost:8002
- **PgAdmin**: http://localhost:5050

---

## Why Use Docker?

### ✅ Advantages
- **Complete Isolation**: No dependency conflicts with your system
- **Production-Ready**: Same environment in dev, staging, and prod
- **Team Consistency**: Everyone runs the exact same setup
- **Easy Reset**: `./dev.sh clean` and start fresh anytime
- **All Services Included**: Frontend, backend, databases, everything!

### ⚠️ Considerations
- Slightly slower startup than local scripts
- Requires Docker Desktop to be running
- File watching/hot reload works but with slight lag

---

## Essential Commands

### Daily Development

```bash
# Start everything
./dev.sh up

# Stop everything
./dev.sh down

# Restart services
./dev.sh restart

# View all logs (live)
./dev.sh logs

# View specific service logs
./dev.sh logs backend
./dev.sh logs frontend
```

### Development Tasks

```bash
# Check running services
./dev.sh ps

# Rebuild images (after dependency changes)
./dev.sh build

# Clean everything (removes volumes too)
./dev.sh clean

# Open backend shell
./dev.sh backend

# Access PostgreSQL
./dev.sh db
```

---

## Understanding Your Setup

### Port Mapping

Your services use these port mappings:

| Service | Container Port | Host Port | Access URL |
|---------|---------------|-----------|------------|
| Frontend | 3000 | **3001** | http://localhost:3001 |
| Backend | 8000 | **8080** | http://localhost:8080 |
| AI Service | 9000 | **9000** | http://localhost:9000 |
| PostgreSQL | 5432 | **5432** | localhost:5432 |
| Redis | 6379 | **6379** | localhost:6379 |
| ChromaDB | 8000 | **8002** | http://localhost:8002 |
| PgAdmin | 80 | **5050** | http://localhost:5050 |

> [!IMPORTANT]
> Notice your backend is on port **8080** (not 8000) and frontend on **3001** (not 3000).
> This is configured in your `.env` file with `BACKEND_PORT=8080` and `FRONTEND_PORT=3001`.

### Frontend API Configuration

Make sure your frontend is configured to call the correct backend URL:

**For Docker setup:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**For local dev setup:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Common Workflows

### 1. Starting Fresh Each Day

```bash
# Start your day
./dev.sh up

# Work on your code...
# Files auto-reload in containers

# End your day
./dev.sh down
```

### 2. Making Code Changes

**Backend changes:**
- Edit files in `/backend/src/`
- Container auto-reloads via uvicorn `--reload`
- Check logs: `./dev.sh logs backend`

**Frontend changes:**
- Edit files in `/frontend/src/`
- Next.js hot reload is active
- Check logs: `./dev.sh logs frontend`

### 3. Adding Dependencies

**Backend:**
```bash
# Add to requirements.txt
echo "new-package==1.0.0" >> backend/requirements.txt

# Rebuild backend image
./dev.sh build
./dev.sh restart backend
```

**Frontend:**
```bash
# Add to package.json
cd frontend
npm install new-package
cd ..

# Rebuild frontend image
./dev.sh build
./dev.sh restart frontend
```

### 4. Database Operations

**Access PostgreSQL directly:**
```bash
./dev.sh db

# Or manually
docker compose exec postgres psql -U postgres -d chaatu
```

**Use PgAdmin (GUI):**
1. Open http://localhost:5050
2. Login: `admin@chaatu.ai` / `admin123`
3. Add Server:
   - Host: `postgres` (use service name, not localhost!)
   - Port: `5432`
   - Database: `chaatu`
   - Username: `postgres`
   - Password: (from your `.env` file)

### 5. Viewing Logs

```bash
# All services
./dev.sh logs

# Specific service (live tail)
./dev.sh logs backend -f

# Last 100 lines
docker compose logs --tail=100 backend

# Since specific time
docker compose logs --since 10m backend
```

---

## Troubleshooting

### Services won't start

```bash
# Check if Docker Desktop is running
docker info

# Check what's using your ports
lsof -i :8080  # Backend
lsof -i :3001  # Frontend

# Clean and restart
./dev.sh clean
./dev.sh up
```

### Backend errors

```bash
# View backend logs
./dev.sh logs backend

# Open backend shell to debug
./dev.sh backend

# Inside container:
python -c "import sqlalchemy; print(sqlalchemy.__version__)"
pip list
```

### Frontend build fails

```bash
# View frontend logs
./dev.sh logs frontend

# Rebuild from scratch
docker compose build --no-cache frontend
./dev.sh restart frontend
```

### Database connection issues

```bash
# Check if PostgreSQL is ready
docker compose exec postgres pg_isready

# Test connection
docker compose exec postgres psql -U postgres -d chaatu -c "SELECT 1"

# View PostgreSQL logs
./dev.sh logs postgres
```

### Port conflicts

```bash
# Check running containers
./dev.sh ps

# Check all Docker processes
docker ps -a

# Remove stopped containers
docker compose rm
```

---

## Switching Between Docker and Local Dev

### From Docker to Local Dev

```bash
# Stop Docker services
./dev.sh down

# Update frontend .env for local backend
# Change: NEXT_PUBLIC_API_URL=http://localhost:8000

# Start local dev
./start-dev.sh
```

### From Local Dev to Docker

```bash
# Stop local services
./stop-dev.sh

# Update frontend .env for Docker backend
# Change: NEXT_PUBLIC_API_URL=http://localhost:8080

# Start Docker
./dev.sh up
```

> [!TIP]
> You can keep databases in Docker and run backend/frontend locally:
> ```bash
> # Start only infrastructure
> docker compose up -d postgres redis chromadb
> 
> # Run backend locally
> cd backend && source venv/bin/activate && uvicorn src.main:app --reload
> 
> # Run frontend locally
> cd frontend && npm run dev
> ```

---

## Advanced Commands

### Rebuild Everything

```bash
# Rebuild all images without cache
docker compose build --no-cache

# Start with fresh build
./dev.sh down
./dev.sh build
./dev.sh up
```

### View Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df
```

### Clean Up Docker

```bash
# Remove all Chaatu containers and volumes
./dev.sh clean

# Remove all Docker build cache (frees space)
docker builder prune

# Remove ALL unused Docker resources
docker system prune -a
```

### Execute Commands in Containers

```bash
# Run command in backend
docker compose exec backend python -c "print('Hello from container')"

# Install package temporarily (lost on restart)
docker compose exec backend pip install requests

# Run tests
docker compose exec backend pytest tests/
```

---

## Best Practices

### ✅ Do

- Use `./dev.sh` commands for consistency
- Check logs when something doesn't work
- Rebuild images after dependency changes
- Use PgAdmin for database inspection
- Keep Docker Desktop running while developing

### ❌ Don't

- Mix Docker and local dev simultaneously (port conflicts)
- Edit files inside containers (changes will be lost)
- Forget to rebuild after changing `Dockerfile` or dependencies
- Delete volumes unless you want to lose database data

---

## Quick Reference

```bash
# Most common commands
./dev.sh up              # Start
./dev.sh down            # Stop
./dev.sh logs backend    # Debug backend
./dev.sh logs frontend   # Debug frontend
./dev.sh ps              # Status
./dev.sh restart         # Restart all
./dev.sh clean           # Reset everything

# Access points
http://localhost:3001    # Your app
http://localhost:8080    # Backend API
http://localhost:5050    # Database GUI
```

---

## Environment Variables

Your Docker setup uses these from `.env`:

```env
# Ports
FRONTEND_PORT=3001
BACKEND_PORT=8080
AI_SERVICE_PORT=9000

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<your-password>
POSTGRES_DB=chaatu
POSTGRES_PORT=5432

# Redis
REDIS_PORT=6379

# ChromaDB
CHROMADB_PORT=8002
CHROMADB_PERSIST_DIR=/chroma/data
```

To change ports, edit `.env` and restart:
```bash
./dev.sh down
./dev.sh up
```

---

## Next Steps

1. **Test your setup**: Open http://localhost:3001
2. **Explore the API**: Visit http://localhost:8080/docs
3. **Check the database**: Open PgAdmin at http://localhost:5050
4. **Start coding**: Edit files and watch them reload!

Your Docker environment is production-ready and fully functional! 🚀
