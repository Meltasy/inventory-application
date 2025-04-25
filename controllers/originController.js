const db = require('../db/queries')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')
const { validationResult } = require('express-validator')

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
    title: 'Vin par origin',
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
    title: 'Vin par origin',
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

const getProducerWineList = asyncHandler(async(req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new CustomError(`Search validation failed: ${errors.array().map(err => err.msg).join(', ')}`, 400))
  }
  const searchProducer = req.query.producer

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

  const listByProducer = await db.getListByProducer(searchProducer)
  console.log('searchProducer: ', searchProducer)
  console.log('listByProducer: ', listByProducer)

  if (!listByProducer) {
    return next(new CustomError('Wine producer list not found.', 404))
  }

  if (listByProducer.length === 0) {
    return next(new CustomError('Wine producer list is empty', 204))
  }

  res.render('allOrigins', {
    title: 'Vin par origin',
    subtitle: `Liste des vins par producteur`,
    listByRegion: regionRows,
    listByAppellation: appellationRows,
    fullWineList: listByProducer,
    searchRegion: '',
    hasSearched: true
  })
})


module.exports = {
  getOriginWineList,
  getEachOriginWineList,
  getProducerWineList
}
