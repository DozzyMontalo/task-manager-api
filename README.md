# task-manager-api  

A simple User/Task ownership restful API, where each user has distict task owing to the relation established on both user schema and task schema (an owner field on taskSchema and tasks virtual on userSchema)\ 
To run this API you would need to run npm install\
You will have to set up a mongoose database by running /users/hp/mongodb/bin/mongod.exe --dbpath=/Users/hp/mongodb-data on your terminal or create a collection on mongoDB atlas.\
You will have to come up with a unique JWT_SECRET key to enabe the user authentication middleware.\
To start the server run "npm run start" on your other terminal.\
You can run test on the HTTP headers on Postman or download Rest Client extension on your visual studio code.\
