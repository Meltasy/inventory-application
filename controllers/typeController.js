const db = require('../db/queries')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')
// Need to add validation to all of the forms
// const { body, validationResult } = require('express-validator')

const getTypeWineList = asyncHandler(async (req, res, next) => {
  const typeWineList = await db.getTypeWine()
  console.log('typeWineList: ', typeWineList)

  if (!typeWineList) {
    return next(new CustomError('Wine type list not found.', 404))
  }
  
  if (typeWineList.length === 0) {
    return next(new CustomError('Wine type list is empty.', 204))
  }

  return res.render('allTypes', { 
    title: 'Wine by type',
    subtitle: 'Choose a color for your wine.',
    typeWineList: typeWineList,
    colorWineList: []
  })
})

const getColorWineList = asyncHandler(async (req, res, next) => {
  const searchColor = req.query.search || ''
  // console.log('searchColor: ', searchColor)
  const [ colorWineList, typeWineList ] = await Promise.all([
    db.getColorWine(searchColor),
    db.getTypeWine()
  ])
  // console.log('colorWineList: ', colorWineList)
  const colorName = searchColor[0].toUpperCase() + searchColor.slice(1)

  return res.render('allTypes', {
    title: 'Wine by type',
    subtitle: searchColor
      ? `${colorName} wine list`
      : 'Choose a color to view wine list.',
    typeWineList: typeWineList,
    colorWineList: colorWineList
  })
})

module.exports = {
  getTypeWineList,
  getColorWineList
}
