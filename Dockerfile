FROM node:18 as buildstage

RUN npm i -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

ENV CHOKIDAR_USEPOLLING=true
ENV WATCHPACK_POLLING=true

COPY . .

RUN pnpm run build  

FROM node:18 as productionstage

RUN npm i -g pnpm

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY --from=buildstage /usr/src/app/dist ./dist
RUN mkdir -p ./src/presentation/graphQL/schema
COPY ./src/presentation/graphQL/schema ./src/presentation/graphQL/schema

CMD ["node", "--experimental-json-modules", "./dist/main.js"]