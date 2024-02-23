## Description

Nest project template with auth + user management + file upload and prisma as orm

## Installation

```bash
$ npm install
```

create .env file with the properties specified in .env.example

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## OpenAPI specification

located at BASE_URL/api

## Running migrations

to format the prisma file:

```bash
$ npm run prisma:format
```

to generate code from the prisma schema

```bash
$ npm run prisma:generate
```

to sync the schema with the db (be careful with that)

```bash
$ npm run prisma:push
```
