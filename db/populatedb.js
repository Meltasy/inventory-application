#! /usr/bin/env node

require('dotenv').config()
const { Client } = require('pg')
const wines = require('./wines')

const SQL = `
CREATE TABLE IF NOT EXISTS wine_origin (
  origin_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  region VARCHAR ( 255 ),
  appellation VARCHAR ( 255 ),
  producer VARCHAR ( 255 ),
  UNIQUE (producer, appellation, region)
);

CREATE TABLE IF NOT EXISTS wine_type (
  type_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  color VARCHAR ( 255 )
);

INSERT INTO wine_type (color)
VALUES ('rouge'), ('blanc'), ('rosé'), ('effervescent');

CREATE TABLE IF NOT EXISTS wine_list (
  wine_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  origin_id INTEGER REFERENCES wine_origin,
  type_id INTEGER REFERENCES wine_type,
  wine_name VARCHAR ( 255 ),
  year INTEGER,
  life_max INTEGER,
  grapes VARCHAR ( 255 ) [],
  qty_empty INTEGER,
  qty_full INTEGER
);`

async function main() {
  const client = new Client({ connectionString: process.env.CONNECTION_STRING })
  await client.connect()

  console.log('Creating tables ...')
  
  await client.query(SQL)

  for (let wine of wines) {
    await client.query(
      `INSERT INTO wine_origin (region, appellation, producer)
      VALUES ($1, $2, $3)
      ON CONFLICT (region, appellation, producer) DO NOTHING;`,
      [wine.region, wine.appellation, wine.producer]
    )
    const { rows: originRows } = await client.query(
      `SELECT origin_id FROM wine_origin
      WHERE region = $1 AND appellation = $2 AND producer = $3;`,
      [wine.region, wine.appellation, wine.producer]
    )
    const originId = originRows[0].origin_id
    const { rows: typeRows } = await client.query(
      `SELECT type_id FROM wine_type WHERE color = $1`,
      [wine.color]
    )
    const typeId = typeRows[0].type_id
    await client.query(
      `INSERT INTO wine_list (origin_id, type_id, wine_name, year, life_max, grapes, qty_empty, qty_full)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
      [originId, typeId, wine.wineName, wine.year, wine.lifeMax, wine.grapes, wine.qtyEmpty, wine.qtyFull]
    )
  }

  await client.end()
  console.log('Done!')
}

main().catch(err => console.error('Error running script: ', err))
