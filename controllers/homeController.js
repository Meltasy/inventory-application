const db = require('../db/queries')
const asyncHandler = require('express-async-handler')
const CustomNotFoundError = require('../errors/CustomNotFoundError')
// const { getWineById } = require('./wineController')
// Need to add validation to all of the forms
// const { body, validationResult } = require('express-validator')

const getWineList = asyncHandler(async (req, res) => {
  const wineList = await db.getAllWines()

  if (!wineList) {
    res.status(404).render('notFound', {
      message: 'No wine list found'
    })
    return
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

async function createWinePost(req, res) {
  const { wineName, wineYear } = req.body
  await db.insertWine(wineName, wineYear)
  res.redirect('/')
}

async function getWineById(req, res) {
  const wineId = req.params.wineId
  const wineDetail = await db.getWineDetail(wineId)

  if(!wineDetail) {
    res.status(404).render('notFound', {
      message: `No wine found with ID ${wineId}`
    })
    return
  }

  res.render('detailWine', {
    title: 'Mon vin',
    wineDetail: wineDetail
  })
}

module.exports = {
  getWineList,
  createWineGet,
  createWinePost,
  getWineById
}
