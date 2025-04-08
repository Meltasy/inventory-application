#! /usr/bin/env node

require('dotenv').config()
const { Client } = require('pg')

const SQL = `
CREATE TABLE IF NOT EXISTS wine_list (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  winename VARCHAR ( 255 ),
  year INTEGER
);

INSERT INTO wine_list (winename, year)
VALUES
  ('Domaine Extondoa Xut', 2022),
  ('La Maison Brana Domaine Brana', 2018),
  ('Domaine Couet Origine', 2022)
`;

async function main() {
  console.log('creating tables...')
  // Check what it says and remove here and on mini-message-board too!
  console.log('Connection String:', process.env.CONNECTION_STRING)
  const client = new Client({
    connectionString: process.env.CONNECTION_STRING
  })
  await client.connect()
  await client.query(SQL)
  await client.end()
  console.log('done')
}

main()
