# 빌드 단계: Gradle 이미지로 빌드
FROM gradle:8.1-jdk21-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# Gradle 설정 파일 복사 및 의존성 캐싱
COPY build.gradle settings.gradle ./
RUN gradle dependencies --no-daemon

# 전체 소스 코드 복사 및 빌드
COPY . ./
RUN gradle clean build -x test --no-daemon

# 실행 단계: 런타임 이미지 생성
FROM openjdk:21-jdk-slim

# 작업 디렉토리 설정
WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=build /app/build/libs/*.jar /app/app.jar

# 실행 명령어 설정
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
