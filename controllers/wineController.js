const db = require('../db/queries')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')
// Need to add validation to all of the forms
// const { body, validationResult } = require('express-validator')

const getWineList = asyncHandler(async (req, res, next) => {
  const wineList = await db.getAllWines()

  if (!wineList) {
    return next(new CustomError('Wine list not found.', 404))
  }
  
  if (wineList.length === 0) {
    return next(new CustomError('Wine list is empty.', 204))
  }

  return res.render('allWines', {
    title: 'Mon cave',
    subtitle: '',
    wineList: wineList
  })
})

const getWineById = asyncHandler(async(req, res, next) => {
  const wineId = req.params.wineId
  const wineDetail = await db.getWineDetail(wineId)

  if(!wineDetail) {
    return next(new CustomError(`No wine found with ID ${wineId}.`, 404))
  }

  return res.render('detailWine', {
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

  return res.render('editWine', {
    title: 'Mettre à jour le vin',
    wineDetail: wineDetail
  })
})

const updateWinePut = asyncHandler(async(req, res, next) => {
  const { wineName, wineYear, wineColor, wineStyle } = req.body
  const wineId = req.params.wineId

  if (!wineName || !wineYear || !wineColor || !wineStyle) {
    return next(new CustomError('Wine name, year, color and style are required!', 400))
  }

  await db.updateWineDetail(wineName, wineYear, wineColor, wineStyle, wineId)
  return res.redirect('/wine')
})

const deleteWineById = asyncHandler(async(req, res, next) => {
  const wineId = req.params.wineId

  if (!wineId) {
    return next(new CustomError(`No wine found with ID ${wineId}.`, 404))
  }

  await db.deleteWine(wineId)
  return res.redirect('/wine')
})

module.exports = {
  getWineList,
  getWineById,
  updateWineGet,
  updateWinePut,
  deleteWineById
}
