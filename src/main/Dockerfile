# Backend Dockerfile for Java Spring Boot app

FROM openjdk:21-jdk-alpine

# Set working directory
WORKDIR /app

# Copy the built jar file from target directory
COPY target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
