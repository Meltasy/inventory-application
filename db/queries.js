const pool = require('./pool')

async function getAllWines() {
  const { rows } = await pool.query('SELECT * FROM wine_list')
  return rows
}

async function insertWine(wineName, wineYear) {
  await pool.query('INSERT INTO wine_list (winename, year) VALUES ($1, $2)', [wineName, wineYear])
}

async function getWineDetail(wineId) {
  const { rows } = await pool.query('SELECT * FROM wine_list WHERE id = $1', [wineId])
  return rows[0]
}

module.exports = {
  getAllWines,
  insertWine,
  getWineDetail
}
