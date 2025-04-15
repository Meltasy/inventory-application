#! /usr/bin/env node

require('dotenv').config()
const { Client } = require('pg')

const SQL = `
CREATE TABLE IF NOT EXISTS wine_type (
  type_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  color VARCHAR ( 255 ),
  wine_style VARCHAR ( 255 ),
  UNIQUE (color, wine_style)
);

  CREATE TABLE IF NOT EXISTS wine_list (
  wine_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  type_id INTEGER REFERENCES wine_type,
  wine_name VARCHAR ( 255 ),
  year INTEGER
);`

const wines = [
  { wineName: 'Domaine Extondoa Xut', year: 2022, color: 'rouge', wineStyle: 'rond' },
  { wineName: 'La Maison Brana Domaine Brana', year: 2018, color: 'rouge', wineStyle: 'rond' },
  { wineName: 'Domaine Couet Origine', year: 2022, color: 'blanc', wineStyle: 'sec' },
  { wineName: 'Domaine Langlois Les Charmes', year: 2022, color: 'blanc', wineStyle: 'sec' },
  { wineName: 'Château Lamothe-Bergeron Cru Bourgeois', year: 2015, color: 'rouge', wineStyle: 'rond' },
  { wineName: 'Le Temps des Sages Les Opiniâtres', year: 2021, color: 'rouge', wineStyle: 'fruité' },
  { wineName: 'Egiategia Dena Dela', year: 2022, color: 'blanc', wineStyle: 'aromatique' },
  { wineName: 'Caves de Pouilly-Sur-Loire Tonelum', year: 2019, color: 'blanc', wineStyle: 'sec' },
]

async function main() {
  const client = new Client({ connectionString: process.env.CONNECTION_STRING })
  await client.connect()

  console.log('Creating tables ...')
  
  await client.query(SQL)

  for (let wine of wines) {
    await client.query(
      'INSERT INTO wine_type (color, wine_style) VALUES ($1, $2) ON CONFLICT (color, wine_style) DO NOTHING',
      [wine.color, wine.wineStyle]
    )
    const { rows } = await client.query(
      'SELECT type_id FROM wine_type WHERE color = $1 AND wine_style = $2',
      [wine.color, wine.wineStyle]
    )
    const typeId = rows[0].type_id
    await client.query(
      'INSERT INTO wine_list (type_id, wine_name, year) VALUES ($1, $2, $3)',
      [typeId, wine.wineName, wine.year]
    )
  }

  await client.end()
  console.log('Done!')
}

main().catch(err => console.error('Error running script: ', err))
