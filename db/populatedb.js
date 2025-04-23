#! /usr/bin/env node

require('dotenv').config()
const { Client } = require('pg')

const SQL = `
CREATE TABLE IF NOT EXISTS wine_origin (
  origin_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  producer VARCHAR ( 255 ),
  appellation VARCHAR ( 255 ),
  region VARCHAR ( 255 ),
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
  { wineName: 'Xut', year: 2022, quantity: '8', color: 'blanc', wineStyle: 'aromatique', producer: 'Domaine Extondoa', appellation: 'Iroulegy', region: 'Sud-Ouest' },
  { wineName: 'Domaine Brana', year: 2022, quantity: '10', color: 'blanc', wineStyle: 'aromatique', producer: 'La Maison Brana', appellation: 'Iroulegy', region: 'Sud-Ouest' },
  { wineName: 'Xut', year: 2022, quantity: '5', color: 'rouge', wineStyle: 'rond', producer: 'Domaine Extondoa', appellation: 'Iroulegy', region: 'Sud-Ouest' },
  { wineName: 'Domaine Brana', year: 2018, quantity: '4', color: 'rouge', wineStyle: 'rond', producer: 'La Maison Brana', appellation: 'Iroulegy', region: 'Sud-Ouest' },
  { wineName: 'Origine', year: 2022, quantity: '4', color: 'blanc', wineStyle: 'sec', producer: 'Domaine Couet', appellation: 'Pouilly-Fumé', region: 'Vallée de la Loire' },
  { wineName: 'Les Charmes', year: 2022, quantity: '4', color: 'blanc', wineStyle: 'sec', producer: 'Domaine Langlois', appellation: 'Coteaux du Giennois', region: 'Vallée de la Loire' },
  { wineName: 'Cru Bourgeois', year: 2015, quantity: '1', color: 'rouge', wineStyle: 'rond', producer: 'Château Lamothe-Bergeron', appellation: 'Haut-Medoc', region: 'Bordelais' },
  { wineName: 'Les Opiniâtres', year: 2021, quantity: '0', color: 'rouge', wineStyle: 'fruité', producer: 'Le Temps des Sages', appellation: 'Luberon', region: 'Vallée du Rhône' },
  { wineName: 'Les Soucas', year: 2021, quantity: '2', color: 'blanc', wineStyle: 'aromatique', producer: 'Domaine le Novi', appellation: 'Luberon', region: 'Vallée du Rhône' },
  { wineName: 'Tonelum', year: 2019, quantity: '3', color: 'blanc', wineStyle: 'sec', producer: 'Caves de Pouilly-Sur-Loire', appellation: 'Pouilly-Fumé', region: 'Vallée de la Loire' },
  { wineName: 'Plateau des Chênes', year: 2021, quantity: '6', color: 'rouge', wineStyle: 'charpenté', producer: 'Famille Brechet', appellation: 'Lirac', region: 'Vallée du Rhône' },
  { wineName: 'Albert & Camille', year: 2021, quantity: '6', color: 'rouge', wineStyle: 'charpenté', producer: 'Domaine La Garrigue', appellation: 'Vacqueyras', region: 'Vallée du Rhône' },
]

async function main() {
  const client = new Client({ connectionString: process.env.CONNECTION_STRING })
  await client.connect()

  console.log('Creating tables ...')
  
  await client.query(SQL)

  for (let wine of wines) {
    await client.query(
      'INSERT INTO wine_origin (producer, appellation, region) VALUES ($1, $2, $3) ON CONFLICT (producer, appellation, region) DO NOTHING',
      [wine.producer, wine.appellation, wine.region]
    )
    await client.query(
      'INSERT INTO wine_type (color, wine_style) VALUES ($1, $2) ON CONFLICT (color, wine_style) DO NOTHING',
      [wine.color, wine.wineStyle]
    )
    const { rows: originRows } = await client.query(
      'SELECT origin_id FROM wine_origin WHERE producer = $1 AND appellation = $2 AND region = $3',
      [wine.producer, wine.appellation, wine.region]
    )
    const originId = originRows[0].origin_id
    const { rows: typeRows } = await client.query(
      'SELECT type_id FROM wine_type WHERE color = $1 AND wine_style = $2',
      [wine.color, wine.wineStyle]
    )
    const typeId = typeRows[0].type_id
    await client.query(
      'INSERT INTO wine_list (origin_id, type_id, wine_name, year, quantity) VALUES ($1, $2, $3, $4, $5)',
      [originId, typeId, wine.wineName, wine.year, wine.quantity]
    )
  }

  await client.end()
  console.log('Done!')
}

main().catch(err => console.error('Error running script: ', err))
