FROM node:20-bullseye
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN cd ./frontend && npm ci  && npm run build && cd ..

RUN cd ./backend && npm ci  && cd ..

RUN mkdir -p /usr/src/app/backend/frontend

RUN cp -r ./frontend/dist/* ./backend/frontend/

WORKDIR  /usr/src/app/backend/

RUN npm run build

EXPOSE 3001

CMD [ "npm", "run", "start:prod" ]