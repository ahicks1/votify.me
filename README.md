# votify.me
SPA voting tool with an AWS backend

# Deploying Lambdas:
## Prerequisites:
* [aws-cli](https://aws.amazon.com/cli/)

To deploy a lambda run the script `./deployLambda <function name>`
# Front End
This was created using [create-react-app](https://facebook.github.io/create-react-app/).

The project is located in the `./votify.me` subdirectory
## Prerequisites:
* [aws-cli](https://aws.amazon.com/cli/)
* Node > 8.0
* NPM > 5.2

Setup all dependancies with `npm install`

To start the development server run `npm start`

To build for production run `npm run-script build`

To sync with aws run: `aws s3 sync . s3://votify.me.development --acl public-read`

