### To run the project locally, run command in terminal

`npm start`

before running this command install all the dependencies

using, `npm install`

### If the DB connection is failing please create a MongoDB atlas account

`paste the connection link in functions/api.js file in conn_str variable, if in case the given connection url doesn't work`

`sign in to -` [MongoDB atlas to store the data in DB](https://www.mongodb.com/atlas/database)

once signed in create the account and paste the connection link in api.js file, conn_str variable value.

### When api will run on http://localhost:3001/

this is the api url `http://localhost:3001/.netlify/functions/api`,

`/users` and `/count` are the two endpoints

### Users

to add the user into DB,

create a post request to, http://localhost:3001/.netlify/functions/api/users
similarly can get the users, by creating a get request to, http://localhost:3001/.netlify/functions/api/users
similarly can update the users, by creating a put request to, http://localhost:3001/.netlify/functions/api/users

`remember to pass the body in update call`

`{
    "firstName":"firstName",
    "lastName":"lastName",
    "age": 20
}`

### hosted the server on netlify but it's not working

please run it locally,

live url - `https://aesthetic-druid-de64dc.netlify.app/.netlify/functions/api/`
