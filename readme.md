[![Build Status](https://travis-ci.org/tarekauel/tkpraktikum.svg?branch=master)](https://travis-ci.org/tarekauel/tkpraktikum)

## Setup ##

### Prerequisite ###
**For convenience reasons the postgres database is deactivated at the moment and a in-memory file is used (`db.json`)**

postgres database available on host: postgres, port: 5432, user: postgres, password: root, database: tk

install strongloop and bower:
```shell
npm i -g strongloop bower
```

#### Docker (Optional) ####

Using docker and docker-compose to setup database:
```
docker-compose up -d
```

On Mac or Windows add to hosts:
```
192.168.99.100 postgres
```

On Linux add to hosts:
```
127.0.0.1 postgres
```

### Install ###

```shell
npm run-script initDb
npm install
```

## Create providers.json ##

- Create a `providers.json` in the root directory
- Register an appt at facebook and github and replace the `clientID` and
   the `clientSecret` with the appropiate values

```json
{
  "local": {
    "provider": "local",
    "module": "passport-local",
    "usernameField": "username",
    "passwordField": "password",
    "authPath": "/auth/local",
    "successRedirect": "/#/submission",
    "failureRedirect": "/#/login",
    "failureFlash": true
  },
  "facebook-login": {
    "provider": "facebook",
    "module": "passport-facebook",
    "clientID": "***",
    "clientSecret": "****",
    "callbackURL": "/auth/facebook/callback",
    "authPath": "/auth/facebook",
    "callbackPath": "/auth/facebook/callback",
    "successRedirect": "/#/account",
    "failureRedirect": "/#/login",
    "scope": ["email"],
    "failureFlash": true
  },
  "github-login": {
    "provider": "github",
    "module": "passport-github",
    "clientID": "***",
    "clientSecret": "***",
    "callbackURL": "/auth/github/callback",
    "authPath": "/auth/github",
    "callbackPath": "/auth/github/callback",
    "successRedirect": "/#/account",
    "failureRedirect": "/#/login",
    "scope": ["user"],
    "failureFlash": true
  }
}
```

## Run ##
```shell
npm start
```

### Run on Docker only ##
```shell
docker-compose -f docker-compose.yml -f docker-compose-run.yml up -d
```

Open in browser (OSX and Windows): [http://192.168.99.100:3000](http://192.168.99.100:3000)

Open in browser (Linux): [http://localhost:3000](http://localhost:3000)
## ER diagram ##
![ER diagram](https://rawgit.com/tarekauel/tkpraktikum/master/doc/ER.svg)
