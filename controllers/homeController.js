const db = require('../db/queries')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')
// Need to add validation to all of the forms
// const { body, validationResult } = require('express-validator')

const getWineList = asyncHandler(async (req, res, next) => {
  const wineList = await db.getAllWines()
  console.log('Wine list: ', wineList)

  if (!wineList) {
    return next(new CustomError('Wine list not found.', 404))
  }
  if (wineList.length === 0) {
    return next(new CustomError('Wine list is empty.', 204))
  }

  res.render('home', {
    title: 'Mon cave',
    wineList: wineList
  })
})

async function createWineGet(req, res) {
  res.render('newWine', {
    title: 'Ajouter du vin'
  })  
}

const createWinePost = asyncHandler(async (req, res, next) => {
  const { wineName, wineYear, wineColor } = req.body
  console.log('req.body', req.body)

  if (!wineName || !wineYear || !wineColor) {
    return next(new CustomError('Wine name, year and color are required!', 400))
  }

  await db.createWine(wineName, wineYear, wineColor)
  res.redirect('/')
})

module.exports = {
  getWineList,
  createWineGet,
  createWinePost
}
