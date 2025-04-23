const db = require('../db/queries')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')

const getOriginWineList = asyncHandler(async(req, res, next) => {
  const listByProducer = await db.getListByProducer()
  const listByAppellation = await db.getListByAppellation()
  const listByRegion = await db.getListByRegion()

  if (!listByProducer || !listByAppellation || !listByRegion) {
    return next(new CustomError('Wine origin list not found.', 404))
  }

  if (listByProducer.length === 0 || listByAppellation.length === 0 || listByRegion.length === 0) {
    return next(new CustomError('Wine origin list is empty.', 204))
  }

  res.render('allOrigins', {
    title: 'Vin par producteur',
    subtitle: 'Please choose a wine origin from the menu.',
    listByProducer: listByProducer,
    listByAppellation: listByAppellation,
    listByRegion: listByRegion
  })
})

const getEachOriginWineList = asyncHandler(async(req, res, next) => {
  // Need to add this function, add queries, add to new, edit and detail views, and check views for allOrigins
})

module.exports = {
  getOriginWineList,
  getEachOriginWineList
}
