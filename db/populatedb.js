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
  color VARCHAR ( 255 ),
  wine_style VARCHAR ( 255 ),
  UNIQUE (color, wine_style)
);

  CREATE TABLE IF NOT EXISTS wine_list (
  wine_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  origin_id INTEGER REFERENCES wine_origin,
  type_id INTEGER REFERENCES wine_type,
  wine_name VARCHAR ( 255 ),
  year INTEGER,
  quantity INTEGER
);`

const wines = [
  { wineName: 'Xut', year: 2022, quantity: '8', color: 'blanc', wineStyle: 'aromatique', region: 'Sud-Ouest', appellation: 'Iroulegy', producer: 'Domaine Extondoa' },
  { wineName: 'Domaine Brana', year: 2022, quantity: '10', color: 'blanc', wineStyle: 'aromatique', region: 'Sud-Ouest', appellation: 'Iroulegy', producer: 'La Maison Brana' },
  { wineName: 'Xut', year: 2022, quantity: '5', color: 'rouge', wineStyle: 'rond', region: 'Sud-Ouest', appellation: 'Iroulegy', producer: 'Domaine Extondoa' },
  { wineName: 'Domaine Brana', year: 2018, quantity: '4', color: 'rouge', wineStyle: 'rond', region: 'Sud-Ouest', appellation: 'Iroulegy', producer: 'La Maison Brana' },
  { wineName: 'Origine', year: 2022, quantity: '4', color: 'blanc', wineStyle: 'sec', region: 'Vallée de la Loire', appellation: 'Pouilly-Fumé', producer: 'Domaine Couet' },
  { wineName: 'Les Charmes', year: 2022, quantity: '4', color: 'blanc', wineStyle: 'sec', region: 'Vallée de la Loire', appellation: 'Coteaux du Giennois', producer: 'Domaine Langlois' },
  { wineName: 'Cru Bourgeois', year: 2015, quantity: '1', color: 'rouge', wineStyle: 'rond', region: 'Bordelais', appellation: 'Haut-Medoc', producer: 'Château Lamothe-Bergeron' },
  { wineName: 'Les Opiniâtres', year: 2021, quantity: '0', color: 'rouge', wineStyle: 'fruité', region: 'Vallée du Rhône', appellation: 'Luberon', producer: 'Le Temps des Sages' },
  { wineName: 'Les Soucas', year: 2021, quantity: '2', color: 'blanc', wineStyle: 'aromatique', region: 'Vallée du Rhône', appellation: 'Luberon', producer: 'Domaine le Novi' },
  { wineName: 'Tonelum', year: 2019, quantity: '3', color: 'blanc', wineStyle: 'sec', region: 'Vallée de la Loire', appellation: 'Pouilly-Fumé', producer: 'Caves de Pouilly-Sur-Loire' },
  { wineName: 'Plateau des Chênes', year: 2021, quantity: '6', color: 'rouge', wineStyle: 'charpenté', region: 'Vallée du Rhône', appellation: 'Lirac', producer: 'Famille Brechet' },
  { wineName: 'Albert & Camille', year: 2021, quantity: '6', color: 'rouge', wineStyle: 'charpenté', region: 'Vallée du Rhône', appellation: 'Vacqueyras', producer: 'Domaine La Garrigue' },
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
    await client.query(
      `INSERT INTO wine_type (color, wine_style)
      VALUES ($1, $2)
      ON CONFLICT (color, wine_style) DO NOTHING;`,
      [wine.color, wine.wineStyle]
    )
    const { rows: typeRows } = await client.query(
      `SELECT type_id FROM wine_type WHERE color = $1 AND wine_style = $2;`,
      [wine.color, wine.wineStyle]
    )
    const typeId = typeRows[0].type_id
    await client.query(
      `INSERT INTO wine_list (origin_id, type_id, wine_name, year, quantity)
      VALUES ($1, $2, $3, $4, $5);`,
      [originId, typeId, wine.wineName, wine.year, wine.quantity]
    )
  }

  await client.end()
  console.log('Done!')
}

main().catch(err => console.error('Error running script: ', err))
