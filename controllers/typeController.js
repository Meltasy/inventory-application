const db = require('../db/queries')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')
// Need to add validation to all of the forms
// const { body, validationResult } = require('express-validator')

const getColorWineList = asyncHandler(async (req, res, next) => {
  const searchColor = req.query.search || ''
  console.log('searchColor: ', searchColor)
  const colorWineList = await db.getColorWine(searchColor)
  console.log('colorWineList: ', colorWineList)
  const colorName = searchColor[0].toUpperCase() + searchColor.slice(1)

  return res.render('allTypes', {
    title: 'Wine by type',
    subtitle: searchColor
      ? `${colorName} wine list`
      : 'Choose a color to view wine list.',
    colorWineList: colorWineList
  })
})

module.exports = {
  getColorWineList
}
