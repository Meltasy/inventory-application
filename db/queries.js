const pool = require('./pool')

async function getAllWines() {
  try {
    const { rows } = await pool.query(
      'SELECT wine_type.type_id, color, wine_style, wine_id, wine_name, year, quantity FROM wine_type INNER JOIN wine_list ON wine_type.type_id = wine_list.type_id'
    )
    return rows
  } catch (err) {
    console.error('Error getting wine list: ', err)
    throw new Error('Impossible to get wine list.')
  }
}

async function getListByColor() {
  try {
    const { rows } = await pool.query(
      'SELECT DISTINCT color FROM wine_type'
    )
    return rows
  } catch(err) {
    console.error('Error getting wine list by color: ', err)
    throw new Error('Impossible to get wine list by color.')
  }
}

async function getListByStyle(wineColor) {
  try {
    const { rows } = await pool.query(
      'SELECT color, wine_style FROM wine_type WHERE color = $1',
      [wineColor]
    )
    return rows
  } catch(err) {
    console.error('Error getting wine list by style: ', err)
    throw new Error('Impossible to get wine list by style.')
  }
}

async function getColorWine(wineColor) {
  try {
    const { rows } = await pool.query(
      'SELECT wine_type.type_id, color, wine_style, wine_id, wine_name, year, quantity FROM wine_type INNER JOIN wine_list ON wine_type.type_id = wine_list.type_id WHERE color = $1',
      [wineColor]
    )
    return rows
  } catch (err) {
    console.error(`Error getting ${wineColor} wine list`, err)
    throw new Error(`Impossible to get ${wineColor} wine list.`)
  }
}

async function getStyleWine(wineColor, wineStyle) {
  try {
    const { rows } = await pool.query(
      'SELECT wine_type.type_id, color, wine_style, wine_id, wine_name, year, quantity FROM wine_type INNER JOIN wine_list ON wine_type.type_id = wine_list.type_id WHERE color = $1 AND wine_style = $2',
      [wineColor, wineStyle]
    )
    return rows
  } catch (err) {
    console.error(`Error getting ${wineColor} - ${wineStyle} wine list`, err)
    throw new Error(`Impossible to get ${wineColor} - ${wineStyle} wine list.`)
  }
}

async function createWine(wineName, wineYear, quantity, wineColor, wineStyle) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO wine_type (color, wine_style) VALUES ($1, $2) ON CONFLICT (color, wine_style) DO NOTHING`,
      [wineColor, wineStyle]
    )
    const { rows } = await client.query(
      'SELECT type_id FROM wine_type WHERE color = $1 AND wine_style = $2',
      [wineColor, wineStyle]
    )
    const typeId = rows[0].type_id
    await client.query(
      'INSERT INTO wine_list (type_id, wine_name, year, quantity) VALUES ($1, $2, $3, $4)',
      [typeId, wineName, wineYear, quantity]
    )
    await client.query('COMMIT')
    return typeId
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
      'SELECT wine_list.type_id, color, wine_style, wine_id, wine_name, year, quantity FROM wine_type INNER JOIN wine_list ON wine_type.type_id = wine_list.type_id WHERE wine_list.wine_id = $1',
      [wineId]
    )
    return rows[0]
  } catch (err) {
    console.error('Error getting details of wine: ', err)
    throw new Error('Impossible to get details of wine.')
  }
}

async function updateWineDetail(wineName, wineYear, quantity, wineColor, wineStyle, wineId) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    // Leaving type in the wine_type TABLE, without checking if other wines are associated - IS THIS OK?
    const typeId = await client.query(
      'SELECT type_id FROM wine_type WHERE color = $1 AND wine_style = $2',
      [wineColor, wineStyle]
    )
    if (!typeId || typeId === 0) {
      typeId = await client.query(
        'INSERT INTO wine_type (color, wine_style) VALUES ($1, $2)',
        [wineColor, wineStyle]
      )
    }
    await client.query(
      'UPDATE wine_list SET wine_name = $1, year = $2, quantity = $3 WHERE wine_id = $4',
      [wineName, wineYear, quantity, wineId]
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

async function updateWineQuantity(quantity, wineId) {
  try {
    const { rows } = await pool.query(
      'UPDATE wine_list SET quantity = $1 WHERE wine_id = $2 RETURNING *',
      [quantity, wineId]
    )
    return rows[0]
  } catch (err) {
    console.error('Error editing quantity of wine: ', err)
    throw new Error('Impossible to edit quantity of wine.')
  }
}

async function deleteWine(wineId) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    // Leaving type in the wine_type TABLE, without checking if other wines are associated - IS THIS OK?
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
  getListByColor,
  getListByStyle,
  getColorWine,
  getStyleWine,
  createWine,
  getWineDetail,
  updateWineDetail,
  updateWineQuantity,
  deleteWine
}
