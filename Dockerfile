
FROM node:14-alpine as builder

WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile
ARG REACT_APP_BASE_URL

COPY . .
RUN yarn build

FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build /usr/share/nginx/html


ENTRYPOINT ["nginx", "-g", "daemon off;"]
