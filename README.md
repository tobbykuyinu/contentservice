# Content Service

The guide herein describes how to get the Content service up and running

### Invoking locally

Before starting the server locally, ensure you have updated the `app.contentservice.env` file with proper configuration for the environment variables. There are two ways to start the server locally:

#### If you have npm and node (v >= 4.3) installed

Run the following commands to start a server:
-  `npm install pm2 -g`
 - `npm install`
 - `npm start`

#### Using Docker with Docker installed (v >= 1.12)

Run the following command to start the local server:
 - `sh local/start.sh`
 
Following any of the above steps should make the app accessible locally on the port specified in the `app.contentservice.env` file (`8082`) and visiting the url `localhost:8082` 
should display a message `Unsupported API version requested`

You can now make requests via the application like this:
 - `http://localhost:8082/v1/content/{postType}/{postCategory}/{postSlug}` 

For an example:
 - `http://localhost:8082/v1/content/advice/Tires/this-is-a-test?country=id`

#### Code Quality and Tests

Linting and regression tests have been setup for the project. To run linting:
 - `npm run lint`
 
To run regression tests:
 - `npm run regression`
 
All commands are to be run from a node environment

## License

MIT
