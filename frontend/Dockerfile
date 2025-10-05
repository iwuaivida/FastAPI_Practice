ARG NODE_VERSION=24.8.0-alpine3.21

FROM node:${NODE_VERSION} AS builder

WORKDIR /frontend

COPY package.json package-lock.json ./

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

FROM nginx:1.28.0-alpine3.21

RUN apk update && apk upgrade

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]