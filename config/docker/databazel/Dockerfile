FROM node:0.10.46

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN npm install npm -g

RUN apt-get update && \
	apt-get install g++

WORKDIR /home/app

ADD databazel.tar.gz ./

WORKDIR ./bundle/programs/server/

RUN npm i

WORKDIR /home/app

ARG meteor_settings

ENV MONGO_URL=mongodb://0.0.0.0:27017/databasel \
    ROOT_URL=http://127.0.0.1 \
    PORT=3000 \
    METEOR_SETTINGS=$meteor_settings \
    KADIRA_APP_ID=QZqWgvaNqqLBFhqSY \
    KADIRA_APP_SECRET=03b4d0d8-60ce-4a36-bdda-3804610013a6

ENTRYPOINT ["node", "bundle/main.js"]

EXPOSE 3000
