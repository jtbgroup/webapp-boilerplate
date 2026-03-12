.PHONY: init dev-start dev-down dev-logs dev-clean dev-full-clean prod set-version show-version quality quality-backend quality-frontend

VERSION := $(shell cat VERSION)

## ─────────────────────────────────────────────
## VERSION MANAGEMENT
## ─────────────────────────────────────────────

## Show current version
show-version:
	@echo "Current version: $(VERSION)"

## Set a new version: make set-version V=x.y.z
set-version:
	@if [ -z "$(V)" ]; then \
		echo "❌ Usage: make set-version V=x.y.z"; \
		exit 1; \
	fi
	@echo "$(V)" > VERSION
	@# Update backend pom.xml
	@mvn -f backend/pom.xml versions:set -DnewVersion=$(V) -DgenerateBackupPoms=false -q
	@# Update frontend package.json
	@cd frontend && npm version $(V) --no-git-tag-version --allow-same-version > /dev/null
	@# Update Angular environment files
	@sed -i "s/appVersion: '[^']*'/appVersion: '$(V)'/" frontend/src/environments/environment.ts
	@sed -i "s/appVersion: '[^']*'/appVersion: '$(V)'/" frontend/src/environments/environment.prod.ts
	@echo "✅ Version set to $(V)"
	@echo "   • VERSION"
	@echo "   • backend/pom.xml"
	@echo "   • frontend/package.json"
	@echo "   • frontend/src/environments/environment.ts"
	@echo "   • frontend/src/environments/environment.prod.ts"

## ─────────────────────────────────────────────
## INIT
## ─────────────────────────────────────────────

## Initialize the project (run once before first dev start)
## Requires Node.js and @angular/cli installed locally
init:
	@if [ -f frontend/package-lock.json ]; then \
		echo "⚠️  frontend already initialized, skipping."; \
	else \
		echo "🔧 Initializing Angular project..."; \
		cd frontend && ng new webappboilerplate --standalone --routing --style=scss --skip-git --directory . && \
		ng add @angular/material --skip-confirmation; \
		echo "✅ Angular initialized."; \
	fi
	cd frontend && npm install
	@echo "✅ Everything initialized. You can now run: make dev-start"

## ─────────────────────────────────────────────
## QUALITY
## ─────────────────────────────────────────────

## Run backend + frontend quality checks (Checkstyle + ESLint + TypeScript)
quality: quality-backend quality-frontend

quality-backend:
	@echo "🔎 Backend quality checks (Checkstyle)"
	cd backend && mvn --batch-mode -q checkstyle:check

quality-frontend:
	@echo "🔎 Frontend quality checks (ESLint + TypeScript)"
	cd frontend && ([ -d node_modules ] || npm ci)
	cd frontend && npm run lint
	cd frontend && npx tsc --noEmit

## ─────────────────────────────────────────────
## PROD
## ─────────────────────────────────────────────

## Start production environment (build + run)
prod:
	docker compose up --build -d

## Stop production environment
prod-down:
	docker compose down

## View production logs
prod-logs:
	docker compose logs -f

## ─────────────────────────────────────────────
## DEV
## ─────────────────────────────────────────────

## Start development environment
dev-start:
	docker compose -f docker-compose.dev.yml up -d --build
	@echo "✓ Dev services started"
	@echo "  App : http://localhost:8080"

## Stop all containers
dev-down:
	docker compose -f docker-compose.dev.yml down
	@echo "✓ Dev services stopped"

## View logs
dev-logs:
	docker compose -f docker-compose.dev.yml logs -f

## Remove all volumes (⚠️ destroys data)
dev-clean:
	docker compose -f docker-compose.dev.yml down -v
	@echo "✓ Dev services cleaned and stopped"

## Full stop, clean and restart
dev-full-restart:
	make dev-clean
	make dev-start


# ============================================
# Database Management Targets
# ============================================

.PHONY: dev-h2 dev-postgres dev-stop build-h2 build-postgres db-clean

# Start development environment with H2 (embedded, fastest iteration)
dev-h2:
	@echo "Starting development with H2 embedded database..."
	docker-compose -f docker-compose.dev.yml up --build

# Start development environment with PostgreSQL
dev-postgres:
	@echo "Starting development with PostgreSQL..."
	docker-compose -f docker-compose.yml up --build

# Stop all services
dev-stop:
	@echo "Stopping all services..."
	docker-compose -f docker-compose.dev.yml down
	docker-compose -f docker-compose.yml down

# Build JAR with H2 profile for testing
build-h2:
	@echo "Building application with H2 profile..."
	./mvnw clean package -Dspring.profiles.active=h2 -DskipTests

# Build JAR with PostgreSQL profile
build-postgres:
	@echo "Building application with PostgreSQL profile..."
	./mvnw clean package -Dspring.profiles.active=postgres -DskipTests

# Clean database volumes
db-clean:
	@echo "Removing database volumes..."
	docker volume rm webappboilerplate-h2-data || true
	docker volume rm webappboilerplate-postgres-data || true
	@echo "Database volumes cleaned"

# Start production environment (PostgreSQL only)
prod-up:
	@echo "Starting production environment with PostgreSQL..."
	docker-compose up -d
	@echo "App running on http://localhost:8090"

# Stop production environment
prod-down:
	@echo "Stopping production environment..."
	docker-compose down

# Show current database status
db-status:
	@echo "Database volumes:"
	docker volume ls | grep webappboilerplate || echo "No webappboilerplate volumes found"
	@echo "\nRunning containers:"
	docker ps --filter "name=webappboilerplate" || echo "No webappboilerplate containers running"

# Run application locally with H2 (no Docker)
run-h2-local:
	@echo "Running application locally with H2..."
	./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=h2"

# Run application locally with PostgreSQL (requires PostgreSQL running)
run-postgres-local:
	@echo "Running application locally with PostgreSQL..."
	./mvnw spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=postgres"
