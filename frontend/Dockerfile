# 1단계: 빌드 단계
FROM node:20-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . /app

# 애플리케이션 빌드
RUN npm run build

# 2단계: 실행 단계
FROM nginx:1.23-alpine

COPY nginx.conf /etc/nginx/nginx.conf

# Nginx 기본 설정 제거
RUN rm -rf /usr/share/nginx/html/*

# 빌드 결과물을 Nginx로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 포트 열기
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]

