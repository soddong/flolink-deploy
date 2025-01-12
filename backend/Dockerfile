# Use JDK 21 slim as the base image
FROM openjdk:21-jdk-slim

# Set working directory
WORKDIR /app

# Install necessary tools
RUN apt-get update && apt-get install -y --no-install-recommends wget unzip && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Download and install Gradle manually
RUN wget https://services.gradle.org/distributions/gradle-8.3-bin.zip -O /tmp/gradle.zip && \
    mkdir /opt/gradle && \
    unzip /tmp/gradle.zip -d /opt/gradle && \
    rm /tmp/gradle.zip

# Set Gradle environment variables
ENV GRADLE_HOME=/opt/gradle/gradle-8.3
ENV PATH=$GRADLE_HOME/bin:$PATH

# Verify Gradle installation
RUN gradle --version

# Copy Gradle Wrapper and configuration files
COPY gradlew ./gradlew
COPY gradle ./gradle
COPY build.gradle settings.gradle ./

# Ensure Gradle Wrapper has execute permissions
RUN chmod +x gradlew

# Download dependencies
RUN ./gradlew dependencies --no-daemon

# Copy source code and build the project
COPY . .
RUN ./gradlew build -x test --no-daemon

# Expose the application port (e.g., 8080)
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "/app/build/libs/backend.jar"]
