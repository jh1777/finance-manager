FROM nginx:1.20-alpine
LABEL "com.centurylinklabs.watchtower.enable"="false"

COPY nginx.conf /etc/nginx/nginx.conf

COPY /dist/finance-manager /usr/share/nginx/html
