# How to deploy to Openshift Local

# Create a new project
oc new-project simple-nodejs-app

# Deploy from your GitHub repository
oc new-app nodejs~https://github.com/YOUR_USERNAME/simple-nodejs-app.git --name=simple-app

# Watch the build process
oc logs -f bc/simple-app

# Wait for deployment to complete
oc get pods -w

# Expose the service to create a route
oc expose svc/simple-app

# Get the route URL
oc get route simple-app