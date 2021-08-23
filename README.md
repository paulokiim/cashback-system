# Cashback System (Back-end) using Express.js

Cashback System is written in Javascript using Node.js to create a backend server.

- Express
- Postgresql
- Sequelize
- Json Web Token (JWT)

## Installation

Cashback System requires [Node.js](https://nodejs.org/) v14+ to run.
Install the dependencies and devDependencies.

```sh
git clone https://github.com/paulokiim/cashback-system.git
cd cashback-system
npm i
```

## After intallation

First of all, you need to create a .env file that have the following variables:

```
PORT=

DB_DIALECT=
DB_USERNAME=
DB_HOST=
DB_PASSWORD=
DB_DATABASE=
DB_PORT=

JWT_TOKEN_SECRET=

EXTERNAL_API=
EXTERNAL_API_TOKEN=
```

Having created .env file, to run the application just type on terminal:

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

## Default Database Tables

If you simply run after instalation:

```
npm run migrate
```

You'll get the following tables:

#### Table Name: user

| Attributes  | document_number | fullName | email    | password | created_at | updated_at |
| ----------- | --------------- | -------- | -------- | -------- | ---------- | ---------- |
| Data Type   | String          | String   | String   | String   | Timestampz | Timestampz |
| Constraints | Primary Key     | Not Null | Not Null | Not Null | Not Null   | Not Null   |

#### Table Name: purchase

| Attributes  | uid         | code       | value    | status   | document_number               | purchase_date | deleted    | created_at | updated_at |
| ----------- | ----------- | ---------- | -------- | -------- | ----------------------------- | ------------- | ---------- | ---------- | ---------- | ---------- |
| Data Types  | Uuid        | String     | Float    | String   | String                        | String        | Timestampz | Boolean    | Timestampz | Timestampz |
| Constraints | Primary Key | Unique Key | Not Null | Not Null | Foreign Key (references user) | Not Null      | Not Null   | Not Null   | Not Null   |

#### Table Name: cashback

| Attributes  | uid         | value    | percentage | purchase_uid                      | created_at | updated_at |
| ----------- | ----------- | -------- | ---------- | --------------------------------- | ---------- | ---------- |
| Data Types  | Uuid        | Double   | Double     | Uuid                              | Timestampz | Timestampz |
| Constraints | Primary Key | Not Null | Not Null   | Foreign Key (references purchase) | Not Null   | Not Null   |

## License

#### **Just use it the way you want!**
