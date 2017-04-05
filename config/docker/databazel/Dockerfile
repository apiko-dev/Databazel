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

ENV MONGO_URL=mongodb://0.0.0.0:27017/databazel \
    ROOT_URL=http://127.0.0.1 \
    PORT=3000 \
    METEOR_SETTINGS=$meteor_settings \
# you may add kadira credentials for app debugging here
#    KADIRA_APP_ID= \
#    KADIRA_APP_SECRET=

ENTRYPOINT ["node", "bundle/main.js"]

EXPOSE 3000
