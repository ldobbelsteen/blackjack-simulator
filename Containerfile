FROM docker.io/library/node:lts-alpine AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM docker.io/library/nginx:alpine
COPY --from=builder /build/dist /usr/share/nginx/html
EXPOSE 80
