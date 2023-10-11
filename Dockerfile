
FROM node:14-alpine as builder

WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile
ARG REACT_APP_BASE_URL

COPY . .
RUN yarn build

FROM registry.sz9wang.com/public/bun_static:latest
COPY --from=builder /app/dist /www

ENTRYPOINT ["bun", "/app/server.js"]
