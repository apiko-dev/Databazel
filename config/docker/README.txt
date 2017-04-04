To launch databazel: 
1) Install docker.
2) Install docker-compose.
3) Make folders mongo_data/db inside databazel_app for keeping your data. You can use command: 'mkdir -p mongo_data/db'.
4) 'docker-compose up --build -d'.
5) Go to localhost:3030.
6) Login using email 'admin@admin.com' and password 'admin'.

To stop our app run 'docker-compose stop' from the databazel_app folder.
To run the app again run 'docker-compose start' from the databazel_app folder.

To update our app, you can substitute bundle inside databazel_app/databazel directory or download new docker-compose archive and replace files inside databazel_app with new ones.
