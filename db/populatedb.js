#! /usr/bin/env node

require('dotenv').config()
const { Client } = require('pg')

const SQL = `
CREATE TABLE IF NOT EXISTS wine_list (
  wine_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  wine_name VARCHAR ( 255 ),
  year INTEGER
);

CREATE TABLE IF NOT EXISTS wine_type (
  wine_id INTEGER REFERENCES wine_list,
  color VARCHAR ( 255 )
);`

const wines = [
  { wineName: 'Domaine Extondoa Xut', year: 2022, color: 'Rouge' },
  { wineName: 'La Maison Brana Domaine Brana', year: 2018, color: 'Rouge' },
  { wineName: 'Domaine Couet Origine', year: 2022, color: 'Blanc' },
  { wineName: 'Domaine Langlois Les Charmes', year: 2022, color: 'Blanc' },
  { wineName: 'Château Lamothe-Bergeron Cru Bourgeois', year: 2015, color: 'Rouge' },
  { wineName: 'Le Temps des Sages Les Opiniâtres', year: 2021, color: 'Rouge' },
  { wineName: 'Egiategia Dena Dela', year: 2022, color: 'Blanc' },
  { wineName: 'Caves de Pouilly-Sur-Loire Tonelum', year: 2019, color: 'Blanc' },
]

async function main() {
  const client = new Client({ connectionString: process.env.CONNECTION_STRING })
  await client.connect()

  console.log('Creating tables ...')
  
  await client.query(SQL)

  for (let wine of wines) {
    const insertWine = await client.query(
      `INSERT INTO wine_list (wine_name, year) VALUES ($1, $2) RETURNING wine_id`,
      [wine.wineName, wine.year]
    )
    const wineId = insertWine.rows[0].wine_id
    await client.query(
      `INSERT INTO wine_type (wine_id, color) VALUES ($1, $2)`,
      [wineId, wine.color]
    )
  }

  await client.end()
  console.log('Done!')
}

main().catch(err => console.error('Error running script: ', err))
