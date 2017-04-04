#!/bin/bash

. ~/.nvm/nvm.sh && echo "nvm installed" || curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash

nvm install 0.10.46
npm install npm -g
cd ./node_modules && npm remove * && cd ../ || echo 'node_modules are not installed'

npm cache clear
npm install --production

meteor build ../build --architecture os.linux.x86_64

cd ../

mkdir composed_app && cd composed_app || echo 'composed_app folder exists' && cd composed_app
mkdir databazel_app || echo 'databazel_app folder exists'

cp -af ../databazel/config/docker/* ./databazel_app

cp -f ../build/databazel.tar.gz ./databazel_app/databazel

tar --exclude='databazel_app/mongo_data' -cvzf databazel_app.tar.gz databazel_app
