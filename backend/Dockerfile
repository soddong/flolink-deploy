# Use the custom Gradle + JDK 21 image
FROM openjdk:21-jdk-slim AS build

WORKDIR /app

COPY build.gradle settings.gradle ./

# Install dependencies
RUN ./gradlew dependencies --no-daemon

COPY . .

# Build the application
RUN ./gradlew build -x test --no-daemon

# Runtime image
FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar /app/backend.jar
ENTRYPOINT ["java", "-jar", "/app/backend.jar"]
