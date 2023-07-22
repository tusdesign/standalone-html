FROM node:14-alpine as builder
WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build /usr/share/nginx/html

ARG REACT_APP_BASE_URL

# Set environment variable
ENV REACT_APP_BASE_URL=${REACT_APP_BASE_URL}
ENTRYPOINT ["nginx", "-g", "daemon off;"]
