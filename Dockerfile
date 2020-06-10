FROM caddy
WORKDIR /data
COPY www .
EXPOSE 80
CMD caddy file-server