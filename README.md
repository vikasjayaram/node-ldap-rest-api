# What is it?

A sample Resource API with CRUD operations.
The domain object (account) corresponds to a typical Auth0 Custom DB table and this API can
therefore act as a webservice fronting LDAP for Custom DB HTTP endpoint access (from Rules, Custom DB Scripts or other webtasks).

## Import the LDAP REST API collection and environment variables into Postman
Click the button below and select the Desktop version of Postman (Chrome extension doesn't support environment variables):

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/9ee11177f3ce1f806ea0)

## Running locally

To run the sample extension locally:

Rename `.env.sample` as `.env` and add the required values for each key value pair.

```bash
$ npm install
$ npm start
```

Alternatively, just do `node server.js` - useful for running in debug mode etc


## To use as Custom DB

The endpoints include the REST endpoints to handle account management & custom signup requirements from within an application -
However, this project also includes endpoints for integration with the Auth0 Custom DB scripts. To run the API locally yet have it called from Auth0 Dashboard scripts, use ngrok to expose your locally running instance over the internet.

Install `ngrok` using `npm i ngrok -g`

To expose the running application over internet use:

`ngrok http 3001 -bind-tls=false`

Now use the generated endpoints in configuration.IDP_ENDPOINT etc of your custom db scripts.
