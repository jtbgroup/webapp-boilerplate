.PHONY: init dev-start dev-down dev-logs dev-clean dev-full-clean prod set-version show-version

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
## PROD
## ─────────────────────────────────────────────

## Start production environment
prod:
	docker compose up --build

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
dev-full-clean:
	make dev-clean
	make dev-start