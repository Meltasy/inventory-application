const db = require('../db/queries')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')

const getTypeWineList = asyncHandler(async (req, res, next) => {
  const listByColor = await db.getListByColor()

  if (!listByColor) {
    return next(new CustomError('Wine color list not found.', 404))
  }

  res.render('allTypes', { 
    title: 'Vin par couleur',
    subtitle: 'Choisissez une couleur de vin dans le menu.',
    listByColor: listByColor,
    colorWineList: [],
    hasSearched: false
  })
})

const getEachTypeWineList = asyncHandler(async (req, res, next) => {
  const searchColor = req.query.color || ''
  const listByColor = await db.getListByColor()
  const colorWineList = await db.getColorWine(searchColor)

  if (!colorWineList) {
    return next(new CustomError('Wine color list not found.', 404))
  }

  res.render('allTypes', {
    title: 'Vin par couleur',
    subtitle: `Liste des vins ${searchColor}`,
    listByColor: listByColor,
    colorWineList: colorWineList,
    hasSearched: true
  })
})

module.exports = {
  getTypeWineList,
  getEachTypeWineList
}
