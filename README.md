##Lab 17 - HTTP REST Server

##Objective
To make a lightweight, RESTFUL server which has GET, POST, and DELETE CRUD methods and tests which verify common functionality of these methods.  Furthermore, a connection with a Mongo DB instance is created and information may be stored for later retrieval.  The object created for storage is a User Account with a schema identifying it via the username, email, passswordHash, and tokenSeed.  Mongo auto generates a unique ID and timestamp which follow the object into the DB.  This object is intended to only live on the server, where an upcoming Profile will live both on the server and client side.

#### Code Style
-Node.js (ES6 notation where possible)
-NPM Dependencies (body-parser, dotenv, express, mongoose, winston)
-Development NPM packages (eslint, faker, jest, and superagent)

## How to Use

To start this app, clone this repo from 

  `http://www.github.com/kerrynordstrom/16-19-auth`

install all necessary packages with 

  `npm install`

Start the Mongo DB server by running the command 

  `npm dbon`

And run any available tests with

  `npm run test`

##Middleware

###Logging 
Logging is handled by the logger middleware, which parses out request methods and URLs into log JSON and also to the console.  These details are generally removed from the base code and are required by express in the server file.

###Error Handling

Errors are handled by the error middleware, which parses out error statuses and messages into log JSON and also to the console.  These details are generally removed from the base code and are required by express in the server file.

## Server Endpoints

* `POST /signup`
  * Creates another instance of an Account when stringified data is passed through POST route.
  * Returns a 200 success status code and creates a user authentication token if passwordHash is created and inserted into DB.
  * Returns a 400 failure status code if either the Username, Email, or passwordHash are missing from the request.
  * Returns a 409 failure status code if any errors are found in the request unrelated to the request body.

* `POST /profiles`
  * Creates another instance of a Profile when stringified data is passed through POST route.
  * Returns a 200 success status code and creates a new profile for a user if token passed via header correctly.
  * Returns a 400 failure status code if the header is not set with the expected token.
  * Returns a 401 error if an incorrect token is passed or is missing entirely.

* `GET /profiles/:id`
  * Passes a user provided token to confirm that they are a registered user and can view any profile with a correct id provided.
  * Returns a 200 success status code and returns a profile at the specified ID if a token is passed via header correctly.
  * Returns a 404 failure status code if an incorrect ID is passed via the get request.
  * Returns a 401 failure status code if an incorrect token is passed or is missing entirely.