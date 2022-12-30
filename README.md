# Prisma Multiple Relation Counts

This example show a way to fetch multiple counts of the same relation using different filtering criteria with Prisma. Specifically, it uses a total of 2 SQL queries to get a list of all users including:

- The count of all posts for each user
- The count of all posts with at least one comment for each user

The second query takes advantage of [Prisma Client's built-in dataloader](https://www.prisma.io/docs/guides/performance-and-optimization/query-optimization-performance#solving-the-n1-problem) which automatically batches requests to `findUnique`.

## How to use

### Prerequisites

- Install [Node.js](https://nodejs.org/en/download/)

### 1. Download example & install dependencies

Clone this repository:

```sh
git clone git@github.com:sbking/prisma-multiple-relation-counts.git
```

Install dependencies:

```sh
npm install
```

### 2. Create an SQLite database and run migrations

Run the following command. An SQLite database will be created automatically:

```sh
npx prisma migrate dev --name init
```

### 3. Run the `dev` script

To run the `script.ts` file, run the following command:

```sh
npm run dev
```
