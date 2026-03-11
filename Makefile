.PHONY: init dev prod down logs clean

## Initialize the project (run once before first dev start)
## Requires Node.js and @angular/cli installed locally
init:
	@if [ -f frontend/package-lock.json ]; then \
		echo "⚠️  frontend already initialized, skipping."; \
	else \
		echo "🔧 Initializing Angular project..."; \
		cd frontend && ng new productgen --standalone --routing --style=scss --skip-git --directory . && \
		ng add @angular/material --skip-confirmation; \
		echo "✅ Angular initialized. You can now run: make dev"; \
	fi

##############
# PROD
##############

## Start production environment
prod:
	docker compose up --build

##############
# DEV
##############

## Start development environment (hot reload)
dev-start:
	docker compose -f docker-compose.dev.yml up -d --build
	@echo "✓ Dev services started"
	@echo "  Frontend : http://localhost:4300"
	@echo "  Backend  : http://localhost:8080"

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
dev-full-clean:
	make dev-clean
	make dev-start