const db = require('../db/queries')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')
const { validationResult } = require('express-validator')

const getWineList = asyncHandler(async (req, res) => {
  const wineList = await db.getAllWines()

  if (!wineList) {
    throw new CustomError('Wine list not found.', 400)
  }
  
  if (wineList.length === 0) {
    throw new CustomError('Wine list is empty.', 204)
  }

  res.render('allWines', {
    title: 'Ma cave à vins française',
    subtitle: '',
    wineList: wineList
  })
})

const getWineById = asyncHandler(async(req, res) => {
  const wineId = req.params.wineId
  const wineDetail = await db.getWineDetail(wineId)

  if(!wineDetail) {
    throw new CustomError(`No wine found with ID ${wineId}.`, 400)
  }

  res.render('detailWine', {
    title: 'Ma cave à vins française',
    wineDetail: wineDetail
  })
})

const updateWineGet = asyncHandler(async(req, res) => {
  const wineId = req.params.wineId
  const wineDetail = await db.getWineDetail(wineId)

  if(!wineDetail) {
    throw new CustomError(`No wine found with ID ${wineId}.`, 400)
  }

  res.render('editWine', {
    title: 'Mettre à jour le vin',
    wineDetail: wineDetail
  })
})

const updateWinePut = asyncHandler(async(req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new CustomError(`Wine validation failed: ${errors.array().map(err => err.msg).join(', ')}`, 400)
  }
  const { wineName, wineYear, lifeMax, qtyEmpty, qtyFull, wineColor, region, appellation, producer } = req.body
  const wineId = req.params.wineId
  if(!wineId) {
    throw new CustomError(`No wine found with ID ${wineId}.`, 400)
  }
  let grapes = req.body.grapes
  if (!Array.isArray(grapes)) {
    grapes = grapes ? [grapes] : []
  }
  grapes = grapes.filter(grape => grape && grape.trim() !== '')
  await db.updateWineDetail(wineName, wineYear, lifeMax, grapes, qtyEmpty, qtyFull, wineColor, region, appellation, producer, wineId)
  res.redirect(`/wine/${wineId}`)
})

const updateQtyPatch = asyncHandler(async(req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new CustomError(`Wine validation failed: ${errors.array().map(err => err.msg).join(', ')}`, 400)
  }
  const { qtyFull } = req.body
  const wineId = req.params.wineId
  if(!wineId) {
    throw new CustomError(`No wine found with ID ${wineId}.`, 400)
  }
  const wineDetail = await db.getWineDetail(wineId)
  let qtyEmpty = wineDetail.qty_empty
  const prevQtyFull = wineDetail.qty_full
  const qtyDifference = prevQtyFull - qtyFull
  if (qtyDifference > 0) {
    qtyEmpty = parseInt(qtyEmpty) + qtyDifference
  }
  await db.updateWineQuantity(qtyEmpty, qtyFull, wineId)
  res.redirect(`/wine/${wineId}`)
})

const deleteWineById = asyncHandler(async(req, res) => {
  const wineId = req.params.wineId
  if (!wineId) {
    throw new CustomError(`No wine found with ID ${wineId}.`, 400)
  }
  await db.deleteWine(wineId)
  res.redirect('/wine')
})

module.exports = {
  getWineList,
  getWineById,
  updateWineGet,
  updateWinePut,
  updateQtyPatch,
  deleteWineById
}
