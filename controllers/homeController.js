const db = require('../db/queries')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')
const { validationResult } = require('express-validator')

const getReadyWineLists = asyncHandler(async(req, res, next) => {
  const [ maxLifeList, primeList ] = await Promise.all([
    await db.getMaxLifeList(),
    await db.getPrimeList()
  ])

  if (!maxLifeList) {
    return next(new CustomError('Short life wine list not found.', 404))
  }

  if (!primeList) {
    return next(new CustomError('Prime wine list not found', 404))
  }

  res.render('home', {
    title: 'Ma cave à vins française',
    searchTitle: 'Recherche de vin',
    maxLifeTitle: 'Vins à boire cette année',
    primeTitle: 'Vins à son apogée cette année',
    maxLifeList: maxLifeList,
    primeList: primeList
  })
})

function createWineGet(req, res) {
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
    const { wineName, wineYear, lifeMax, qtyFull, wineColor, region, appellation, producer } = req.body
    let grapes = req.body.grapes
    if (!Array.isArray(grapes)) {
      grapes = grapes ? [grapes] : []
    }
    grapes = grapes.filter(grape => grape && grape.trim() !== '')
    await db.createWine(wineName, wineYear, lifeMax, grapes, 0, qtyFull, wineColor, region, appellation, producer)
    res.redirect('/')
  } catch (err) {
    next(err)
  }
})

module.exports = {
  getReadyWineLists,
  createWineGet,
  createWinePost
}
