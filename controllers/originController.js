const db = require('../db/queries')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')
const { validationResult } = require('express-validator')

const getOriginWineList = asyncHandler(async(req, res) => {
  const [ listByRegion, listByAppellation ] = await Promise.all([
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

  if (!listByRegion || !listByAppellation) {
    throw new CustomError('Wine origin list not found.', 400)
  }

  if (listByRegion.length === 0 || listByAppellation.length === 0) {
    throw new CustomError('Wine origin list is empty.', 204)
  }

  res.render('allOrigins', {
    title: 'Vin par origine',
    subtitle: 'Choisissez un région ou un appellation.',
    listByRegion: listByRegion,
    listByAppellation: listByAppellation,
    fullWineList: [],
    hasSearched: false
  })
})

const getEachOriginWineList = asyncHandler(async(req, res) => {
  const searchRegion = req.query.region || ''
  const searchAppellation = req.query.appellation || ''

  const [ listByRegion, listByAppellation ] = await Promise.all([
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

  if (!fullWineList) {
    throw new CustomError('Wine producer list not found.', 400)
  }

  res.render('allOrigins', {
    title: 'Vin par origine',
    subtitle: searchAppellation
      ? `Liste des vins: ${searchAppellation}, ${searchRegion}`
      : `Liste des vins: ${searchRegion}`,
    listByRegion: listByRegion,
    listByAppellation: listByAppellation,
    fullWineList: fullWineList || [],
    hasSearched: true
  })
})

const getProducerWineList = asyncHandler(async(req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new CustomError(`Search validation failed: ${errors.array().map(err => err.msg).join(', ')}`, 400)
  }
  const searchProducer = req.query.producer

  const [ listByRegion, listByAppellation ] = await Promise.all([
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

  if (!listByProducer) {
    throw new CustomError('Wine producer list not found.', 400)
  }

  res.render('allOrigins', {
    title: 'Vin par origine',
    subtitle: `Liste des vins: ${searchProducer}`,
    listByRegion: listByRegion,
    listByAppellation: listByAppellation,
    fullWineList: listByProducer || [],
    hasSearched: true
  })
})

module.exports = {
  getOriginWineList,
  getEachOriginWineList,
  getProducerWineList
}
