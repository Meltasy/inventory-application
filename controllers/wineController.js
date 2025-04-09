const db = require('../db/queries')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')
// Need to add validation to all of the forms
// const { body, validationResult } = require('express-validator')

const getWineById = asyncHandler(async(req, res, next) => {
  const wineId = req.params.wineId
  const wineDetail = await db.getWineDetail(wineId)

  if(!wineDetail) {
    return next(new CustomError(`No wine found with ID ${wineId}.`, 404))
  }

  res.render('detailWine', {
    title: 'Mon vin',
    wineDetail: wineDetail
  })
})

const updateWineGet = asyncHandler(async(req, res, next) => {
  const wineId = req.params.wineId
  const wineDetail = await db.getWineDetail(wineId)

  if(!wineDetail) {
    return next(new CustomError(`No wine found with ID ${wineId}.`, 404))
  }

  res.render('editWine', {
    title: 'Mettre à jour le vin',
    wineDetail: wineDetail
  })
})

const updateWinePut = asyncHandler(async(req, res, next) => {
  const { wineName, wineYear } = req.body
  const wineId = req.params.wineId

  if (!wineName || !wineYear) {
    return next(new CustomError('Wine name and year are required!', 400))
  }

  await db.updateWineDetail(wineName, wineYear, wineId)
  res.redirect('/')
})

const deleteWineById = asyncHandler(async(req, res, next) => {
  const wineId = req.params.wineId

  if (!wineId) {
    return next(new CustomError(`No wine found with ID ${wineId}.`, 404))
  }

  await db.deleteWine(wineId)
  res.redirect('/')
})

module.exports = {
  getWineById,
  updateWineGet,
  updateWinePut,
  deleteWineById
}
