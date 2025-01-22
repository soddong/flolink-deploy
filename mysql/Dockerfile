# MySQL 공식 이미지 사용
FROM mysql:8.0

# 환경 변수 설정
ENV MYSQL_DATABASE=flolink
ENV MYSQL_USER=gus9300
ENV MYSQL_PASSWORD=tvxq1226@
ENV MYSQL_ROOT_PASSWORD=rootpassword

# 초기화 SQL 스크립트 추가 (옵션)
ADD ./init.sql /docker-entrypoint-initdb.d/
