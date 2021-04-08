# Setup env

-   Copy .example.env to .env or run `cp .example.env .env`

Insert respective values.

```.env
INFURA_PROJECT_ID=<your-infura-project-id>
INFURA_PROJECT_SECRET=<your-infura-project-secret>
MNEMONIC=<your-mnemonic>
```

# Update required parameters in [migration](migrations/2_byn.js)

# Install node_modules

-   `npm i -g truffle yarn rimraf`
-   `npm i`
-   `cd client && yarn`

# Deploy on a network

-   Deploy on kovan: `truffle migrate --network kovan`

# Build React App

-   `cd client && yarn build`

# Deployment on heroku

You can either push the deployment directy to heroku after build or use the cli:

### Install heroku

-   `npm i -g heroku`

### Authenticate CLI

-   `heroku login`

### Create heroku app or use existing app:

For creating:

-   `heroku create $APP_NAME -b https://github.com/mars/create-react-app-buildpack.git`
-   `git remote add heroku https://git.heroku.com/$APP_NAME.git`

For using existing:

-   `git remote add heroku https://git.heroku.com/$APP_NAME.git`

### Commit your changes before deployment

`git add . && git commit -am <your commit message>`

### Push to heroku

Run from top-level

-   `git subtree push --prefix client heroku master`
-   `heroku open`
