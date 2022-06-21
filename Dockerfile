FROM node AS builder
WORKDIR /build
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run check
RUN npm run test
RUN npm run build

FROM caddy
COPY --from=builder /build/dist /usr/share/caddy
EXPOSE 80
