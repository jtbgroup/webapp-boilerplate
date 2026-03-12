# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS builder

WORKDIR /build

# Copy project files
COPY pom.xml .
COPY backend/src ./backend/src
COPY backend/pom.xml ./backend/

# Build application
RUN mvn clean package -DskipTests -q

# Extract JAR
RUN mkdir -p target/dependency && \
    cd target/dependency && \
    jar -xf ../*.jar

# ============================================
# Development stage (with H2 support)
# ============================================
FROM eclipse-temurin:21-jdk-alpine AS development

WORKDIR /app

# Install curl for health checks and git for hot-reload scenarios
RUN apk add --no-cache curl git

# Copy built application from builder
COPY --from=builder /build/target/dependency/BOOT-INF/lib /app/lib
COPY --from=builder /build/target/dependency/BOOT-INF/classes /app

# Create data directory for H2
RUN mkdir -p /app/data && chmod 777 /app/data

# Copy source for hot reload support
COPY backend/src /app/backend/src
COPY pom.xml /app/pom.xml

# Expose debug and app ports
EXPOSE 8080 5005

# Development entrypoint with H2 profile
ENV SPRING_PROFILES_ACTIVE=h2
ENV JAVA_OPTS="-Xmx512m -Xms256m -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005"

ENTRYPOINT ["java", "-cp", "/app:/app/lib/*", "com.hlrattor.HlrattorApplication"]

# ============================================
# Production stage (PostgreSQL)
# ============================================
FROM eclipse-temurin:21-jdk-alpine AS production

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy built application from builder
COPY --from=builder /build/target/dependency/BOOT-INF/lib /app/lib
COPY --from=builder /build/target/dependency/BOOT-INF/classes /app
COPY --from=builder /build/target/dependency/META-INF /app/META-INF

# Create non-root user for security
RUN addgroup -g 1001 appuser && \
    adduser -D -u 1001 -G appuser appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 8090

# Production entrypoint with PostgreSQL profile
ENV SPRING_PROFILES_ACTIVE=postgres
ENV JAVA_OPTS="-Xmx1024m -Xms512m"

ENTRYPOINT ["java", "-cp", "/app:/app/lib/*", "com.webappboilerplate.WebappBoilerplateApplication"]
