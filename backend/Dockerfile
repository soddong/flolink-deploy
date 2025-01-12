# Use JDK 21 slim as the base image
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Install necessary tools
RUN apt-get update && apt-get install -y \
    bash \
    libc6 \
    wget \
    unzip \
    dos2unix \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy Gradle Wrapper and configuration files
COPY gradlew ./gradlew
COPY gradle ./gradle
COPY build.gradle settings.gradle ./

# Ensure Gradle Wrapper has execute permissions
RUN dos2unix ./gradlew
RUN chmod +x ./gradlew

# Debug Gradle Wrapper
RUN ls -l ./gradlew && ./gradlew --version

# Download dependencies
RUN ./gradlew dependencies --no-daemon

# Copy source code and build the project
COPY . .
RUN ./gradlew build -x test --no-daemon

# Expose the application port
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "/app/build/libs/backend.jar"]
