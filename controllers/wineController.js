// Need to change this to postgreSQL database
// const database = require(database)
const asyncHandler = require('express-async-handler')
const CustomNotFoundError = require('../errors/CustomNotFoundError')

const getWineById = asyncHandler(async (req, res) => {
  const { wineId } = req.params

  const wine = await db.getWineById(Number(wineId))

  if (!wine) {
    throw new CustomNotFoundError('Wine not found')
  }

  res.send(`Wine name: ${wine.name}`)
})

module.exports = { getWineById }
