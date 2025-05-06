const db = require('../db/queries')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')
const { validationResult } = require('express-validator')

async function createWineGet(req, res) {
  res.render('newWine', {
    title: 'Ajouter du vin'
  })  
}

const getMaxLifeWineList = asyncHandler(async(req, res, next) => {
  const maxLifeList = await db.getAllMaxLifeWine(lifeMax = new Date().getFullYear())

  if (!maxLifeList) {
    return next(new CustomError('Short life wine list not found.', 404))
  }

  res.render('home', {
    title: 'Ma cave à vins française',
    searchTitle: 'Recherche de vin',
    sectionTitle: 'Vins à boire cette année',
    maxLifeList: maxLifeList
  })
})

const createWinePost = asyncHandler(async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new CustomError(`Wine validation failed: ${errors.array().map(err => err.msg).join(', ')}`, 400))
    }
    const { wineName, wineYear, lifeMax, qtyFull, wineColor, region, appellation, producer } = req.body
    let grapes = req.body['grapes[]']
    if (!Array.isArray(grapes)) {
      grapes = [grapes]
    }
    grapes = grapes.filter(grape => grape && grape.trim() !== '')
    // Can we remove the below and have at least one grape variety as required?
    // if (grapes.length === 0) {
    //   grapes = ['Non spécifié']
    // }
    console.log('Saving grapes:', grapes)
    await db.createWine(wineName, wineYear, lifeMax, grapes, qtyEmpty = 0, qtyFull, wineColor, region, appellation, producer)
    res.redirect('/')
  } catch (err) {
    next(err)
  }
})

module.exports = {
  getMaxLifeWineList,
  createWineGet,
  createWinePost
}
