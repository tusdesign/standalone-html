
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile
ARG REACT_APP_BASE_URL

COPY . .
RUN yarn build


FROM node:18-alpine AS final
WORKDIR /app

COPY --from=builder /app/dist ./
RUN npm install -g serve

EXPOSE 3000

CMD [ "serve", "-s", "/app" , "-l", "3000" ]
