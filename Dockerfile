FROM nginx:alpine-slim
LABEL "com.centurylinklabs.watchtower.enable"="false"

COPY nginx.conf /etc/nginx/nginx.conf

COPY /dist/finance-manager /usr/share/nginx/html
