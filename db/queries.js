const pool = require('./pool')

async function getAllWines() {
  try {
    const { rows } = await pool.query(
      'SELECT wine_id, wine_name, year, wine_type.color_id, color FROM wine_list INNER JOIN wine_type ON wine_list.color_id = wine_type.color_id'
    )
    return rows
  } catch (err) {
    console.error('Error getting wine list: ', err)
    throw new Error('Impossible to get wine list.')
  }
}

async function getTypeWine() {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM wine_type'
    )
    console.log('wine_type', rows)
    return rows
  } catch(err) {
    console.error('Error getting wine type list: ', err)
    throw new Error('Impossible to get wine type list.')
  }
}

async function getColorWine(wineColor) {
  try {
    const { rows } = await pool.query(
      'SELECT wine_id, wine_name, year, wine_type.color_id, color FROM wine_list INNER JOIN wine_type ON wine_list.color_id = wine_type.color_id WHERE color = $1',
      [wineColor]
    )
    return rows
  } catch (err) {
    console.error(`Error getting ${wineColor} wine list`, err)
    throw new Error(`Impossible to get ${wineColor} wine list.`)
  }
}

// Need to add wine_style to new wine options before it will work!
async function createWine(wineName, wineYear, wineColor) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO wine_type (color) VALUES ($1) ON CONFLICT (color) DO NOTHING`,
      [wineColor]
    )
    const { rows } = await client.query(
      'SELECT color_id FROM wine_type WHERE color = $1',
      [wineColor]
    )
    const colorId = rows[0].color_id
    await client.query(
      'INSERT INTO wine_list (wine_name, year, color_id) VALUES ($1, $2, $3)',
      [wineName, wineYear, colorId]
    )
    await client.query('COMMIT')
    return colorId
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
      'SELECT wine_id, wine_name, year, wine_list.color_id, color FROM wine_list INNER JOIN wine_type ON wine_list.color_id = wine_type.color_id WHERE wine_list.wine_id = $1',
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
    // Leaving color in the wine_type TABLE, without checking if other wines are associated - IS THIS OK?
    const colorId = await client.query(
      'SELECT color_id FROM wine_type WHERE color = $1',
      [wineColor]
    )
    // console.log('colorId: ', colorId)
    if (!colorId || colorId === 0) {
      colorId = await client.query(
        'INSERT INTO wine_type (color) VALUES ($1)',
        [wineColor]
      )
    }
    await client.query(
      'UPDATE wine_list SET wine_name = $1, year = $2 WHERE wine_id = $3',
      [wineName, wineYear, wineId]
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
    // Leaving color in the wine_type TABLE, without checking if other wines are associated - IS THIS OK?
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
  getTypeWine,
  getColorWine,
  createWine,
  getWineDetail,
  updateWineDetail,
  deleteWine
}
