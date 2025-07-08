# Dockerfile for Spring Boot Backend

# Use OpenJDK 17 as base image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Install Maven and wget for health checks
RUN apt-get update && \
    apt-get install -y maven wget && \
    rm -rf /var/lib/apt/lists/*

# Copy Maven configuration files
COPY pom.xml .

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/stasis-0.0.1-SNAPSHOT.jar"]
