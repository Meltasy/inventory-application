const pool = require('./pool')

async function getAllMaxLifeWine(lifeMax) {
  try {
    const { rows } = await pool.query(
      `SELECT wine_id, wine_name, year, wine_origin.origin_id, producer, appellation, region, wine_type.type_id, color
      FROM wine_list
      INNER JOIN wine_origin ON wine_list.origin_id = wine_origin.origin_id
      INNER JOIN wine_type ON wine_list.type_id = wine_type.type_id
      WHERE life_max = $1 AND qty_full > 0
      ORDER BY wine_name;`,
      [lifeMax]
    )
    return rows
  } catch (err) {
    console.error('Error getting short life wine list: ', err)
    throw new Error('Impossible to get short life wine list.')
  } 
}

async function getAllWines() {
  try {
    const { rows } = await pool.query(
      `SELECT wine_id, wine_name, year, qty_full, wine_origin.origin_id, producer, appellation, region, wine_type.type_id, color
      FROM wine_list
      INNER JOIN wine_origin ON wine_list.origin_id = wine_origin.origin_id
      INNER JOIN wine_type ON wine_list.type_id = wine_type.type_id
      ORDER BY wine_name;`
    )
    return rows
  } catch (err) {
    console.error('Error getting wine list: ', err)
    throw new Error('Impossible to get wine list.')
  }
}

async function getListByRegion() {
  try {
    const { rows } = await pool.query(
      'SELECT DISTINCT region FROM wine_origin ORDER BY region;'
    )
    return rows
  } catch(err) {
    console.error('Error getting wine list by region: ', err)
    throw new Error('Impossible to get wine list by region.')
  }
}

async function getListByAppellation(region) {
  try {
    const { rows } = await pool.query(
      'SELECT DISTINCT appellation FROM wine_origin WHERE region = $1 ORDER BY appellation;',
      [region]
    )
    return rows
  } catch(err) {
    console.error('Error getting wine list by appellation: ', err)
    throw new Error('Impossible to get wine list by appellation.')
  }
}

async function getRegionWine(region) {
  try {
    const { rows } = await pool.query(
      `SELECT wine_id, wine_name, year, qty_full, wine_origin.origin_id, producer, appellation, region, wine_type.type_id, color
      FROM wine_list
      INNER JOIN wine_origin ON wine_list.origin_id = wine_origin.origin_id
      INNER JOIN wine_type ON wine_list.type_id = wine_type.type_id
      WHERE region = $1
      ORDER BY producer;`,
      [region]
    )
    return rows
  } catch (err) {
    console.error(`Error getting ${region} wine list.`, err)
    throw new Error(`Impossible to get ${region} wine list.`)
  }
}

async function getAppellationWine(region, appellation) {
  try {
    const { rows } = await pool.query(
      `SELECT wine_id, wine_name, year, qty_full, wine_origin.origin_id, producer, appellation, region, wine_type.type_id, color
      FROM wine_list
      INNER JOIN wine_origin ON wine_list.origin_id = wine_origin.origin_id
      INNER JOIN wine_type ON wine_list.type_id = wine_type.type_id
      WHERE region = $1 AND appellation = $2
      ORDER BY producer;`,
      [region, appellation]
    )
    return rows
  } catch (err) {
    console.error(`Error getting ${region} - ${appellation} wine list.`, err)
    throw new Error(`Impossible to get ${region} - ${appellation} wine list.`)
  }
}

async function getListByProducer(producer) {
  try {
    const { rows } = await pool.query(
      `SELECT wine_id, wine_name, year, qty_full, wine_origin.origin_id, producer, appellation, region, wine_type.type_id, color
      FROM wine_list
      INNER JOIN wine_origin ON wine_list.origin_id = wine_origin.origin_id
      INNER JOIN wine_type ON wine_list.type_id = wine_type.type_id
      WHERE producer ILIKE $1
      ORDER BY wine_name;`,
      [`%${producer}%`]
    )
    return rows
  } catch(err) {
    console.error(`Error getting ${producer} wine list.`, err)
    throw new Error(`Impossible to get ${producer} wine list.`)
  }
}

async function getListByColor() {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM wine_type ORDER BY type_id;'
    )
    return rows
  } catch(err) {
    console.error('Error getting wine list by color: ', err)
    throw new Error('Impossible to get wine list by color.')
  }
}

async function getColorWine(wineColor) {
  try {
    const { rows } = await pool.query(
      `SELECT wine_id, wine_name, year, qty_full, wine_origin.origin_id, producer, appellation, region, wine_type.type_id, color
      FROM wine_list
      INNER JOIN wine_origin ON wine_list.origin_id = wine_origin.origin_id
      INNER JOIN wine_type ON wine_list.type_id = wine_type.type_id
      WHERE color = $1
      ORDER BY wine_name;`,
      [wineColor]
    )
    return rows
  } catch (err) {
    console.error(`Error getting ${wineColor} wine list.`, err)
    throw new Error(`Impossible to get ${wineColor} wine list.`)
  }
}

async function createWine(wineName, wineYear, lifeMax, qtyEmpty, qtyFull, wineColor, region, appellation, producer) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(
      `INSERT INTO wine_origin (region, appellation, producer)
      VALUES ($1, $2, $3)
      ON CONFLICT (region, appellation, producer) DO NOTHING;`,
      [region, appellation, producer]
    )
    const { rows: originRows } = await client.query(
      `SELECT origin_id FROM wine_origin
      WHERE region = $1 AND appellation = $2 AND producer = $3;`,
      [region, appellation, producer]
    )
    const originId = originRows[0].origin_id
    const { rows: typeRows } = await client.query(
      `SELECT type_id FROM wine_type
      WHERE color = $1;`,
      [wineColor]
    )
    const typeId = typeRows[0].type_id
    await client.query(
      `INSERT INTO wine_list (origin_id, type_id, wine_name, year, life_max, qty_empty, qty_full)
      VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [originId, typeId, wineName, wineYear, lifeMax, qtyEmpty, qtyFull]
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
      `SELECT wine_id, wine_name, year, life_max, qty_empty, qty_full, wine_origin.origin_id, producer, appellation, region, wine_type.type_id, color
      FROM wine_list
      INNER JOIN wine_origin ON wine_list.origin_id = wine_origin.origin_id
      INNER JOIN wine_type ON wine_list.type_id = wine_type.type_id
      WHERE wine_list.wine_id = $1;`,
      [wineId]
    )
    return rows[0]
  } catch (err) {
    console.error('Error getting details of wine: ', err)
    throw new Error('Impossible to get details of wine.')
  }
}

async function updateWineDetail(wineName, wineYear, lifeMax, qtyEmpty, qtyFull, wineColor, region, appellation, producer, wineId) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    // Leaving origin in the wine_origin TABLE without checking if other wines are associated - IS THIS OK?
    await client.query(
      `INSERT INTO wine_origin (region, appellation, producer)
      VALUES ($1, $2, $3)
      ON CONFLICT (region, appellation, producer) DO NOTHING;`,
      [region, appellation, producer]
    )
    const { rows: originRows } = await client.query(
      `SELECT origin_id FROM wine_origin
      WHERE region = $1 AND appellation = $2 AND producer = $3;`,
      [region, appellation, producer]
    )
    const originId = originRows[0].origin_id
    const { rows: typeRows } = await client.query(
      `SELECT type_id FROM wine_type
      WHERE color = $1;`,
      [wineColor]
    )
    const typeId = typeRows[0].type_id
    await client.query(
      `UPDATE wine_list SET origin_id = $1, type_id = $2, wine_name = $3, year = $4, life_max = $5, qty_empty = $6, qty_full = $7
      WHERE wine_id = $8;`,
      [originId, typeId, wineName, wineYear, lifeMax, qtyEmpty, qtyFull, wineId]
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

async function updateWineQuantity(qtyEmpty, qtyFull, wineId) {
  try {
    const { rows } = await pool.query(
      `UPDATE wine_list
      SET qty_empty = $1, qty_full = $2
      WHERE wine_id = $3
      RETURNING *;`,
      [qtyEmpty, qtyFull, wineId]
    )
    return rows[0]
  } catch (err) {
    console.error('Error editing wine quantity: ', err)
    throw new Error('Impossible to edit wine quantity.')
  }
}

async function deleteWine(wineId) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    // Leaving origin in the wine_origin TABLE without checking if other wines are associated - IS THIS OK?
    await client.query('DELETE FROM wine_list WHERE wine_id = $1;', [wineId])
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
  getAllMaxLifeWine,
  getAllWines,
  getListByRegion,
  getListByAppellation,
  getRegionWine,
  getAppellationWine,
  getListByProducer,
  getListByColor,
  getColorWine,
  createWine,
  getWineDetail,
  updateWineDetail,
  updateWineQuantity,
  deleteWine
}
