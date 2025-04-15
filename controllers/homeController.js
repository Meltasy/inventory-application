const db = require('../db/queries')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')
// Need to add validation to all of the forms
// const { body, validationResult } = require('express-validator')

async function createWineGet(req, res) {
  res.render('newWine', {
    title: 'Ajouter du vin'
  })  
}

const createWinePost = asyncHandler(async (req, res, next) => {
  const { wineName, wineYear, wineColor } = req.body

  if (!wineName || !wineYear || !wineColor) {
    return next(new CustomError('Wine name, year and color are required!', 400))
  }

  await db.createWine(wineName, wineYear, wineColor)
  res.redirect('/')
})

module.exports = {
  createWineGet,
  createWinePost
}
