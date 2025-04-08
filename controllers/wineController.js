// Need to change this to postgreSQL database
// const database = require(database)
const asyncHandler = require('express-async-handler')
const CustomNotFoundError = require('../errors/CustomNotFoundError')
// Need to add validation to all of the forms
// const { body, validationResult } = require('express-validator')

const getWineById = asyncHandler(async (req, res) => {
  const { wineId } = req.params

  const wine = await db.getWineById(Number(wineId))

  if (!wine) {
    // Should we remove this and just use the notFound 404 page?
    throw new CustomNotFoundError('Wine not found')
  }

  // res.send(`Wine name: ${wine.name}`)
  res.render('detailWine', {
    title: wine.name,
    wineDetail: wine
  })
})

module.exports = { getWineById }
