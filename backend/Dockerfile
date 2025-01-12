# Use JDK 21-alpine as the base image
FROM openjdk:21-alpine

# Set working directory
WORKDIR /app

# Install necessary tools and Gradle manually
RUN apk update && apk add --no-cache wget unzip && \
    wget https://services.gradle.org/distributions/gradle-8.3-bin.zip -O /tmp/gradle.zip && \
    mkdir /opt/gradle && \
    unzip /tmp/gradle.zip -d /opt/gradle && \
    rm /tmp/gradle.zip

# Set Gradle environment variables
ENV GRADLE_HOME=/opt/gradle/gradle-8.3
ENV PATH=$GRADLE_HOME/bin:$PATH

# Verify Gradle installation
RUN gradle --version

# Copy Gradle Wrapper and project configuration files
COPY gradlew ./
COPY gradle ./gradle
COPY build.gradle settings.gradle ./
RUN chmod +x gradlew

# Download project dependencies
RUN ./gradlew dependencies --no-daemon

# Copy the entire source code and build the project
COPY . .
RUN ./gradlew build -x test --no-daemon

# Expose the application port (e.g., 8080)
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "/app/build/libs/backend.jar"]