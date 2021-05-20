FROM nginx:1.20-alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY /dist/finance-manager /usr/share/nginx/html