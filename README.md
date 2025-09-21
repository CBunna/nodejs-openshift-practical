# How to deploy to Openshift Local

## Create a new project
oc new-project simple-nodejs-app

## Deploy from your GitHub repository
oc new-app nodejs~https://github.com/YOUR_USERNAME/simple-nodejs-app.git --name=simple-app

## Watch the build process
oc logs -f bc/simple-app

## Wait for deployment to complete
oc get pods -w

## Expose the service to create a route
oc expose svc/simple-app

## Get the route URL
oc get route simple-app


![image alt](https://github.com/CBunna/nodejs-openshift-practical/blob/58ccc00b24c689952fece21dc33fb260b9aa7fdc/Screenshot%202025-09-21%20at%2017.03.18.png)

![image alt](https://github.com/CBunna/nodejs-openshift-practical/blob/58ccc00b24c689952fece21dc33fb260b9aa7fdc/Screenshot%202025-09-21%20at%2017.03.44.png)
