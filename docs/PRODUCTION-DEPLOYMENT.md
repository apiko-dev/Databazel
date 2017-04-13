### No SSL setup

0) You need to have Meteor and Node Installed.
##### Note, it is very important to use specific `node` version while installing node_modules and deploying Databazel.
You can check required node version by typing `meteor node -v` at your
terminal while in Databazel directory.
You can use [nvm](https://github.com/creationix/nvm) tool for managing your node installation. 
##### You should also use npm of 3.x.x version.
You can check your version by  `npm -v` command.
npm can be updated via `npm install npm -g`
***
1) Fill in *server* (`"host", "username", path to "pem" file:, "env": "MONGO_URL":`), *env* (`"PORT", "ROOT_URL", "MONGO_URL"`) and *appName* data in config/mup.json
3) Add credentials to `config/settings.json` file (your email credentials, kadira keys etc.)
3) use `deploy-quasar.sh` script to install software needed for running quasar-analytics tool at your server that you've configured in `mup.json`
4) install node_modules using `npm i` command.
5) navigate to `config` directory and use [mupx](https://www.npmjs.com/package/mupx) to `setup` and `deploy` your Databazel app. 

### SSL setup
1) connect to your server via `ssh`
2) download and install https://certbot.eff.org/#ubuntutrusty-nginx
    ```wget https://dl.eff.org/certbot-auto
    chmod a+x certbot-auto
    export LC_ALL="en_US.UTF-8"
    export LC_CTYPE="en_US.UTF-8"```

3) `sudo -H ./certbot-auto certonly -d your_domain --standalone`
4) install and configure nginx
 - `sudo apt-get install nginx`
 - configure nginx file (see config/etc_nginx_sites-enabled_your_domain.conf for example):
    - **replace your_domain for your domain name in all following instructions**
    - `sudo nano /etc/nginx/sites-enabled/your_domain.conf`
    - add lines from file example config file
    - `sudo nginx -t`
    - `sudo service nginx restart`

5) add auto renewal:
    ```
    sudo crontab -e
    # renew ssl sertificates if required at 2:30 am on Mondays
    30 2 * * *  ~/certbot-auto renew --pre-hook "service nginx stop" --post-hook "service nginx start" --no-self-upgrade >> /var/log/le-renew.log
    ```
6) switch back to your local machine
7) configure `"PORT"` and `"ROOT_URL"` in  `mup.json` to those you set in nginx config file
    ```
    "PORT": 3000,
    "ROOT_URL": "http://localhost",
    ```
8) run `mupx setup` and then `mupx deploy`
9) if not working try `sudo service nginx restart` again at your server
10) Do not forget to configure your domain setting properly
