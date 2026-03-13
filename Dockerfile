# Build stage
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /build
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests -q

# ============================================
# Development stage
# ============================================
FROM eclipse-temurin:21-jdk-alpine AS development
WORKDIR /app
RUN apk add --no-cache curl git
COPY --from=builder /build/target/*.jar app.jar
EXPOSE 8080 5005
ENV SPRING_PROFILES_ACTIVE=h2
ENV JAVA_OPTS="-Xmx512m -Xms256m -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005"
ENTRYPOINT ["java", "-jar", "app.jar"]

# ============================================
# Production stage
# ============================================
FROM eclipse-temurin:21-jdk-alpine AS production
WORKDIR /app
RUN apk add --no-cache curl
RUN addgroup -g 1001 appuser && adduser -D -u 1001 -G appuser appuser && chown -R appuser:appuser /app
COPY --from=builder /build/target/*.jar app.jar
USER appuser
EXPOSE 8090
ENV SPRING_PROFILES_ACTIVE=postgres
ENV JAVA_OPTS="-Xmx1024m -Xms512m"
ENTRYPOINT ["java", "-jar", "app.jar"]
