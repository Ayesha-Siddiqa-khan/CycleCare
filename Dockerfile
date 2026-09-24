# CycleCare is a static app: nginx serves the built files directly.
FROM nginx:1.27-alpine

COPY index.html app.js styles.css /usr/share/nginx/html/

EXPOSE 80
