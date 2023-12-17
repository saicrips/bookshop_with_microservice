FROM mysql:5.7

ENV MYSQL_ROOT_PASSWORD=my-secret-pw
ENV MYSQL_ALLOW_EMPTY_PASSWORD=true
ENV MYSQL_DATABASE=booksdb

COPY ./data/dump.sql /docker-entrypoint-initdb.d/