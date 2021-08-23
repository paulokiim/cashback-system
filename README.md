# Cashback System (Back-end) using Express.js

Cashback System is written in Javascript using Node.js to create a backend server.

- Express
- Postgresql
- Sequelize

## Installation

Cashback System requires [Node.js](https://nodejs.org/) v14+ to run.
Install the dependencies and devDependencies and start the server.

```sh
git clone https://github.com/paulokiim/cashback-system.git
cd cashback-system
npm i
```

## After intallation

To run the application just type on terminal:

```sh
npm start
```

## Create Migrations

To create migrations for your database simply run:

```sh
NAME={migration_name} npm run create
```

## Running Migrations

To execute the migrations created simply run:

```sh
npm run migrate
```

## To undo last Migration

To undo last migration simply run:

```sh
npm run undo
```

## Routes

For route **/regiter**:

```
Input is json:
{
    fullName,
    documentNumber,
    email,
    password
}
Response is json:
{
    status,
    data: {
        created: true
    }
}
```

For route **/login**:

```
Input is json:
{
    documentNumber,
    password
}
Response is json:
{
    status,
    data: {
        token,
        auth: true
    }
}
```

For route **/purchase/create**:

```
Input is json:
{
    code,
    value,
    purchaseDate
}
Response is json:
{
    status,
    data: {
        purchase:    {
            uid,
            code,
            value,
            purchaseDate,
            status,
            deleted,
            documentNumber,
            createdAt,
            updatedAt
        },
        cashback: {
            uid,
            value,
            percentage,
            purchaseUid,
            createdAt,
            updatedAt
        }
    }
}
```

For route **/purchase/edit**:

```
Input is json:
{
    code,
    purchaseDate,
    editedValues
}
Response is json:
{
    status,
    data: {
        purchase:    {
            uid,
            code,
            value,
            purchaseDate,
            status,
            deleted,
            documentNumber,
            createdAt,
            updatedAt
        },
        cashback: {
            uid,
            value,
            percentage,
            purchaseUid,
            createdAt,
            updatedAt
        }
    }
}
```

For route **/purchase/remove**:

```
Input is json:
{
    code,
    purchaseDate,
}
Response is json:
{
    status,
    data: {
        uid,
        code,
        value,
        purchaseDate,
        status,
        deleted: true,
        documentNumber,
        createdAt,
        updatedAt
    }
}
```

For route **/purchase/list**:

```
Input none:
Response is json:
{
    status,
    data: [
            {
                code,
                value,
                purchaseDate,
                cashbackValue,
                cashbackPercentage,
            },
            ...
    ]
}
```

For route **/cashback/amount**:

```
Input none:
Response is json:
{
    status,
    data
}
```

## License

**Just use it the way you want!**
