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

async function updateWineDetail(wineName, wineYear, wineId) {
  await pool.query('UPDATE wine_list SET winename = $1, year = $2 WHERE id = $3', [wineName, wineYear, wineId])
}

async function deleteWine(wineId) {
  await pool.query('DELETE FROM wine_list WHERE id = $1', [wineId])
}

module.exports = {
  getAllWines,
  insertWine,
  getWineDetail,
  updateWineDetail,
  deleteWine
}
