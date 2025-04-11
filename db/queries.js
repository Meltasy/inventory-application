const pool = require('./pool')

async function getAllWines() {
  try {
    const { rows } = await pool.query(
      'SELECT wine_list.wine_id, wine_name, year, color FROM wine_list INNER JOIN wine_type ON wine_list.wine_id = wine_type.wine_id'
    )
    return rows
  } catch (err) {
    console.error('Error getting wine list: ', err)
    throw new Error('Impossible to get wine list.')
  }
}

async function getColorWine(wineColor) {
  try {
    const { rows } = await pool.query(
      'SELECT wine_list.wine_id, wine_name, year, color FROM wine_list INNER JOIN wine_type ON wine_list.wine_id = wine_type.wine_id WHERE LOWER(color) = LOWER($1)',
      [wineColor]
    )
    return rows
  } catch (err) {
    console.error(`Error getting ${wineColor} wine list`, err)
    throw new Error(`Impossible to get ${wineColor} wine list.`)
  }
}

async function createWine(wineName, wineYear, wineColor) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const insertWine = await client.query(
      'INSERT INTO wine_list (wine_name, year) VALUES ($1, $2) RETURNING wine_id',
      [wineName, wineYear]
    )
    const wineId = insertWine.rows[0].wine_id
    await client.query(
      `INSERT INTO wine_type (wine_id, color) VALUES ($1, $2)`,
      [wineId, wineColor]
    )
    await client.query('COMMIT')
    return wineId
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Error adding new wine to list: ', err)
    throw new Error('Impossible to add new wine to the list.')
  } finally {
    client.release()
  }
}

async function getWineDetail(wineId) {
  try {
    const { rows } = await pool.query(
      'SELECT wine_list.wine_id, wine_name, year, color FROM wine_list INNER JOIN wine_type ON wine_list.wine_id = wine_type.wine_id WHERE wine_list.wine_id = $1',
      [wineId]
    )
    return rows[0]
  } catch (err) {
    console.error('Error getting details of wine: ', err)
    throw new Error('Impossible to get details of wine.')
  }
}

async function updateWineDetail(wineName, wineYear, wineColor, wineId) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      'UPDATE wine_list SET wine_name = $1, year = $2 WHERE wine_id = $3',
      [wineName, wineYear, wineId]
    )
    await client.query(
      'UPDATE wine_type SET color = $1 WHERE wine_id = $2',
      [wineColor, wineId]
    )
    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Error editing details of wine: ', err)
    throw new Error('Impossible to edit details of wine.')
  } finally {
    client.release()
  }
}

async function deleteWine(wineId) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query('DELETE FROM wine_type WHERE wine_id = $1', [wineId])
    await client.query('DELETE FROM wine_list WHERE wine_id = $1', [wineId])
    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Error deleting wine from list: ', err)
    throw new Error('Impossible to delete wine from the list.')
  } finally {
    client.release()
  }
}

module.exports = {
  getAllWines,
  getColorWine,
  createWine,
  getWineDetail,
  updateWineDetail,
  deleteWine
}
