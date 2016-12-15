# Carmudi Content Service

> Lambda function

## Getting Started

### What is a Lambda function?

>The code you run on AWS Lambda is uploaded as a “Lambda function”. Each function has associated configuration information, such as its name, description, entry point, and resource requirements. The code must be written in a “stateless” style i.e. it should assume there is no affinity to the underlying compute infrastructure. Local file system access, child processes, and similar artifacts may not extend beyond the lifetime of the request, and any persistent state should be stored in Amazon S3, Amazon DynamoDB, or another Internet-available storage service. Lambda functions can include libraries, even native ones.  

[Excerpt from AWS website](https://aws.amazon.com/lambda/faqs/#functions)

### How does this work?

For local development, we've created a node server in the local directory

### Invoking locally

There are two ways to start the server locally:

#### If you have npm and node (v >= 4.3) installed

Run the following commands to start a server:
 - `npm install`
 - `npm run local`

#### Using Docker with Docker installed (v >= 1.12)

Run the following command to start the local server:
 - `sh local/start.sh`
 
Following any of the above steps should make the app accessible locally on the port specified in the `local/server.js` file (`8082`) and visiting the url `localhost:8082` should display a message `Welcome to Carmudi Content Service`

You can now make requests via the application like this:
 - `http://localhost:8082/content/{postType}/{postSlug}` 

For an example:
 - `http://localhost:8082/content/advice/this-is-a-test`

#### Code Quality and Tests

Linting and regression tests have been setup for the project. To run linting:
 - `npm install jscs jshint -g`
 - `jscs . && jshint .`
 
To run regression tests:
 - `npm run regression`
 
All commands are to be run from a node environment

## License

MIT
