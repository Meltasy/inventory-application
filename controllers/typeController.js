const db = require('../db/queries')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')
// Need to add validation to all of the forms
// const { body, validationResult } = require('express-validator')

const getTypeWineList = asyncHandler(async (req, res, next) => {
  const colorRows = await db.getListByColor()
  const listByColor = colorRows.map(row => row.color)
  
  let listByStyle = {}
  for (let color of listByColor) {
    const styleRows = await db.getListByStyle(color)
    listByStyle[color] = styleRows.map(row => row.wine_style)
  }

  if (!listByColor || !listByStyle) {
    return next(new CustomError('Wine type list not found.', 404))
  }
  
  if (listByColor.length === 0 || listByStyle === 0) {
    return next(new CustomError('Wine type list is empty.', 204))
  }

  return res.render('allTypes', { 
    title: 'Wine by type',
    subtitle: 'Please choose a wine type from the menu.',
    listByColor: colorRows,
    listByStyle: listByStyle,
    colorWineList: [],
    searchColor: '',
    hasSearched: false
  })
})

const getEachTypeWineList = asyncHandler(async (req, res, next) => {
  const searchColor = req.query.color || ''
  const searchStyle = req.query.style || ''

  const [ colorRows, styleRows ] = await Promise.all([
    db.getListByColor(),
    db.getListByColor().then(rows => {
      let styleMap = {}
      return Promise.all(rows.map(async row => {
        const styles = await db.getListByStyle(row.color)
        styleMap[row.color] = styles.map(s => s.wine_style)
        return styleMap
      })).then(() => styleMap)
    })
  ])

  let colorWineList = []
  if (searchColor && searchStyle) {
    colorWineList = await db.getStyleWine(searchColor, searchStyle)
  } else if (searchColor) {
    colorWineList = await db.getColorWine(searchColor)
  }

  return res.render('allTypes', {
    title: 'Wine by type',
    subtitle: searchStyle
    ? `${searchColor} - ${searchStyle} wine list`
    : `${searchColor} wine list`,
    listByColor: colorRows,
    listByStyle: styleRows,
    colorWineList: colorWineList,
    searchColor: searchColor,
    hasSearched: true
  })
})

module.exports = {
  getTypeWineList,
  getEachTypeWineList
}
