const db = require('../db/queries')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')

const getOriginWineList = asyncHandler(async(req, res, next) => {
  const regionRows = await db.getListByRegion()
  const listByRegion = regionRows.map(row => row.region)
  
  const listByAppellation = {}
  for (let region of listByRegion) {
    const appellationRows = await db.getListByAppellation(region)
    listByAppellation[region] = appellationRows.map(row => row.appellation)
  }

  if (!listByRegion || !listByAppellation) {
    return next(new CustomError('Wine origin list not found.', 404))
  }

  if (listByRegion.length === 0 || listByAppellation.length === 0) {
    return next(new CustomError('Wine origin list is empty.', 204))
  }

  res.render('allOrigins', {
    title: 'Vin par région ou appellation',
    subtitle: 'Choisissez un région ou un appellation.',
    listByRegion: regionRows,
    listByAppellation: listByAppellation,
    fullWineList: [],
    searchRegion: '',
    hasSearched: false
  })
})

const getEachOriginWineList = asyncHandler(async(req, res, next) => {
  const searchRegion = req.query.region || ''
  const searchAppellation = req.query.appellation || ''

  const [ regionRows, appellationRows ] = await Promise.all([
    db.getListByRegion(),
    db.getListByRegion().then(async (rows) => {
      let appellationMap = {}
      await Promise.all(rows.map(async row => {
        const appellations = await db.getListByAppellation(row.region)
        appellationMap[row.region] = appellations.map(a => a.appellation)
      }))
      return appellationMap
    })
  ])

  let fullWineList = []
  if (searchRegion && searchAppellation) {
    fullWineList = await db.getAppellationWine(searchRegion, searchAppellation)
  } else if (searchRegion) {
    fullWineList = await db.getRegionWine(searchRegion)
  }

  res.render('allOrigins', {
    title: 'Vin par région ou appellation',
    subtitle: searchAppellation
      ? `Liste des vins par ${searchAppellation}, ${searchRegion}`
      : `Liste des vins par ${searchRegion}`,
    listByRegion: regionRows,
    listByAppellation: appellationRows,
    fullWineList: fullWineList,
    searchRegion: searchRegion,
    hasSearched: true
  })
})

module.exports = {
  getOriginWineList,
  getEachOriginWineList
}
