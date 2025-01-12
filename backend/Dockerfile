# Step 1: JDK 21.0.4 기반 이미지 사용
FROM openjdk:21-alpine AS build

# Set working directory
WORKDIR /app

# Step 2: Gradle 수동 설치
# Gradle 버전을 직접 설치 (예: Gradle 8.3)
RUN apt-get update && apt-get install -y wget unzip && \
    wget https://services.gradle.org/distributions/gradle-8.3-bin.zip -O /tmp/gradle.zip && \
    mkdir /opt/gradle && \
    unzip /tmp/gradle.zip -d /opt/gradle && \
    rm /tmp/gradle.zip

# Set Gradle environment variables
ENV GRADLE_HOME=/opt/gradle/gradle-8.3
ENV PATH=$GRADLE_HOME/bin:$PATH

# Verify Gradle installation
RUN gradle --version

# Step 3: Copy Gradle Wrapper and project files
COPY gradlew ./
COPY gradle ./gradle
COPY build.gradle settings.gradle ./
RUN chmod +x gradlew

# Download dependencies
RUN ./gradlew dependencies --no-daemon

# Step 4: Copy source code and build
COPY . .
RUN ./gradlew build -x test --no-daemon

# Step 5: JRE 21.0.4 기반 런타임 이미지 생성
FROM openjdk:21.0.4-jre-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar /app/backend.jar

# Start the application
ENTRYPOINT ["java", "-jar", "/app/backend.jar"]
