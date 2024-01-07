FROM node:20-slim
RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

RUN cd ./frontend && npm i  && npm run build && cd ..

RUN cd ./backend && npm i  && cd ..

RUN mkdir -p /usr/src/app/backend/frontend

RUN cp -r ./frontend/dist/* ./backend/frontend/

WORKDIR  /usr/src/app/backend/

RUN npm run build

EXPOSE 3001

CMD [ "sleep", "infinity" ]