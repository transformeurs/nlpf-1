FROM node:16-alpine as builder

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

FROM nginxinc/nginx-unprivileged:1-alpine-slim AS production

COPY --chown=nginx:nginx ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder --chown=nginx:nginx /app/out/ /usr/share/nginx/html/

EXPOSE 8080
