# Cinema.Database: AWS Implementation

## Description 

This repo contains code from my AWS refactor and redeploy of Cinema.Database [(see original app)](https://cinemadatabase.netlify.app/). To save the cost of keeping this app deployed on the cloud, the live version of this web app is no longer publicly available. This repo holds the new original code used in the now-retired app.

In addition to the app's original functionality refactored and deployed to the cloud, this app contained new functionality that allowed the user to upload images to an S3 bucket, view a list of thumbnails of images in the bucket, and view the original images as requested.

For a full break-down of the development of this cloud app, see the [overview](https://liztheshiz.github.io/portfolio-website/portfolio-pages/aws-img-app.html) and [case study](https://liztheshiz.github.io/portfolio-website/aws-case.html) on my portfolio page (case study upcoming).

## Repo notes

This repo does not contain all of the code in the Cinema.Database AWS app. Since the bulk of its code can already be found in the [Cinema.Database client repo](https://github.com/liztheshiz/movie-client) and [API repo](https://github.com/liztheshiz/movie-api), this repo contains only the significant portions of new code or files that were added to this deployment.

The lambda-function/index.js file contains the handler function uploaded as a Lambda function. The actual upload included all modules and its package.json file.

The movie-api/index.js file contains only the newly written code that was added to the index.js file on the web servers. In addition to this added code, the MongoDB URI environment variable directed to a private EC2 instance on which the database was running instead of the original MongoDB Atlas deployment.

The files under movie-client/ were added to the client code, which was deployed to an S3 bucket configured as a static website. In addition to these files, all API calls from the client site were changed from the Heroku API deployment to the DNS of the web server ALB on AWS.

## Dependencies

In addition to the dependencies of the original Cinema.Database app, these new dependencies were added:

### Web servers

- express-fileupload

### Lambda function

- sharp