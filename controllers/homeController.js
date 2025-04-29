const db = require('../db/queries')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')
const { validationResult } = require('express-validator')

async function createWineGet(req, res) {
  res.render('newWine', {
    title: 'Ajouter du vin'
  })  
}

const createWinePost = asyncHandler(async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new CustomError(`Wine validation failed: ${errors.array().map(err => err.msg).join(', ')}`, 400))
    }
    const { wineName, wineYear, qtyFull, wineColor, region, appellation, producer } = req.body
    await db.createWine(wineName, wineYear, qtyEmpty = 0, qtyFull, wineColor, region, appellation, producer)
    res.redirect('/')
  } catch (err) {
    next(err)
  }
})

module.exports = {
  createWineGet,
  createWinePost
}
