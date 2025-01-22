# MySQL 공식 이미지 사용
FROM mysql:8.0

# 환경 변수 설정
ENV MYSQL_DATABASE=flolink
ENV MYSQL_USER=gus9300
ENV MYSQL_PASSWORD=tvxq1226@
ENV MYSQL_ROOT_PASSWORD=rootpassword

# tzdata 설치 및 시간대 설정
RUN apt-get update && apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    echo "Asia/Seoul" > /etc/timezone && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 초기화 SQL 스크립트 추가 (옵션)
ADD ./init.sql /docker-entrypoint-initdb.d/
