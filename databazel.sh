#!/bin/bash

if which apt-get 2>/dev/null

then
  sudo apt-get update
  which java && echo "java found" || sudo apt-get -y install default-jre
  which node && echo "node found" || sudo apt-get install -y nodejs
  which npm && echo "npm found" || sudo apt-get install -y npm

else
	sudo brew update
  which java && echo "java found" || sudo brew install homebrew/emacs/javaimp
  which node && echo "node found" || sudo brew install node

fi

which meteor && echo "meteor found" || curl https://install.meteor.com/ | sh

npm install

if [ ! -f ../quasar.jar ]
then
  curl -L https://github.com/quasar-analytics/quasar/releases/download/v11.4.5-quasar-web/quasar-web-assembly-11.4.5.jar -o ../quasar.jar;
fi

java -jar ../quasar.jar -c config/quasar.json &
meteor run --settings config/settings.json

exit 0
