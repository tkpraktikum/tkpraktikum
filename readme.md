[![Build Status](https://travis-ci.org/tarekauel/tkpraktikum.svg?branch=master)](https://travis-ci.org/tarekauel/tkpraktikum)

## Setup ##

### Prerequisite ###
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
npm install
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
