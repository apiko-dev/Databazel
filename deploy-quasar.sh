#!/bin/bash

cd config/

hostLine=$(grep '"host"' mup.json)
pemLine=$(grep 'pem' mup.json)
userLine=$(grep 'username' mup.json)
host=`sed 's/.*"host": "\(.*\)".*/\1/' <<< $hostLine`
pem=`sed 's/.*"pem": "\(.*\)".*/\1/' <<< $pemLine`
user=`sed 's/.*"username": "\(.*\)".*/\1/' <<< $userLine`

chmod 400 $pem


scp -i $pem quasar.json "$user@$host:~/"
ssh -i $pem $user@$host << EOF
	if [ ! -f quasar.jar ]
	then
	  curl -L https://github.com/quasar-analytics/quasar/releases/download/v11.4.5-quasar-web/quasar-web-assembly-11.4.5.jar -o quasar.jar;
	fi

	if which java 2>/dev/null
	then
		echo "java found"
	else
		sudo add-apt-repository ppa:webupd8team/java
		sudo apt-get update
		echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | sudo /usr/bin/debconf-set-selections
		sudo apt-get -y install oracle-java8-installer
	fi

	java -jar quasar.jar -c quasar.json > /dev/null &
EOF

cd ../../

exit 0
