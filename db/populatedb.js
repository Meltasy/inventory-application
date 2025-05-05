#! /usr/bin/env node

require('dotenv').config()
const { Client } = require('pg')

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
  qty_empty INTEGER,
  qty_full INTEGER
);`

const wines = [
  { wineName: 'Xut', year: 2022, lifeMax: 2028, qtyEmpty: 4, qtyFull: 8, color: 'blanc', region: 'Sud-Ouest', appellation: 'Irouleguy', producer: 'Domaine Extondoa' },
  { wineName: 'Domaine Brana', year: 2022, lifeMax: 2031, qtyEmpty: 2, qtyFull: 10, color: 'blanc', region: 'Sud-Ouest', appellation: 'Irouleguy', producer: 'La Maison Brana' },
  { wineName: 'Xut', year: 2022, lifeMax: 2027, qtyEmpty: 7, qtyFull: 5, color: 'rouge', region: 'Sud-Ouest', appellation: 'Irouleguy', producer: 'Domaine Extondoa' },
  { wineName: 'Domaine Brana', year: 2018, lifeMax: 2033, qtyEmpty: 2, qtyFull: 4, color: 'rouge', region: 'Sud-Ouest', appellation: 'Irouleguy', producer: 'La Maison Brana' },
  { wineName: 'Origine', year: 2022, lifeMax: 2025, qtyEmpty: 2, qtyFull: 4, color: 'blanc', region: 'Vallée de la Loire', appellation: 'Pouilly-Fumé', producer: 'Domaine Couet' },
  { wineName: 'Les Charmes', year: 2022, lifeMax: 2026, qtyEmpty: 2, qtyFull: 4, color: 'blanc', region: 'Vallée de la Loire', appellation: 'Coteaux du Giennois', producer: 'Domaine Langlois' },
  { wineName: 'Cru Bourgeois', year: 2015, lifeMax: 2025, qtyEmpty: 5, qtyFull: 1, color: 'rouge', region: 'Bordelais', appellation: 'Haut-Medoc', producer: 'Château Lamothe-Bergeron' },
  { wineName: 'Les Opiniâtres', year: 2021, lifeMax: 2026, qtyEmpty: 3, qtyFull: 0, color: 'rouge', region: 'Vallée du Rhône', appellation: 'Luberon', producer: 'Le Temps des Sages' },
  { wineName: 'Les Soucas', year: 2021, lifeMax: 2029, qtyEmpty: 1, qtyFull: 2, color: 'blanc', region: 'Vallée du Rhône', appellation: 'Luberon', producer: 'Domaine le Novi' },
  { wineName: 'Tonelum', year: 2019, lifeMax: 2025, qtyEmpty: 3, qtyFull: 3, color: 'blanc', region: 'Vallée de la Loire', appellation: 'Pouilly-Fumé', producer: 'Caves de Pouilly-Sur-Loire' },
  { wineName: 'Plateau des Chênes', year: 2021, lifeMax: 2028, qtyEmpty: 0, qtyFull: 6, color: 'rouge', region: 'Vallée du Rhône', appellation: 'Lirac', producer: 'Famille Brechet' },
  { wineName: 'Albert & Camille', year: 2021, lifeMax: 2028, qtyEmpty: 0, qtyFull: 6, color: 'rouge', region: 'Vallée du Rhône', appellation: 'Vacqueyras', producer: 'Domaine La Garrigue' },
]

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
      `INSERT INTO wine_list (origin_id, type_id, wine_name, year, life_max, qty_empty, qty_full)
      VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [originId, typeId, wine.wineName, wine.year, wine.lifeMax, wine.qtyEmpty, wine.qtyFull]
    )
  }

  await client.end()
  console.log('Done!')
}

main().catch(err => console.error('Error running script: ', err))
