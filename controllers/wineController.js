const db = require('../db/queries')
const asyncHandler = require('express-async-handler')
const CustomError = require('../errors/CustomError')
const { validationResult } = require('express-validator')

const getWineList = asyncHandler(async (req, res, next) => {
  const wineList = await db.getAllWines()

  if (!wineList) {
    return next(new CustomError('Wine list not found.', 404))
  }
  
  if (wineList.length === 0) {
    return next(new CustomError('Wine list is empty.', 204))
  }

  res.render('allWines', {
    title: 'Ma cave à vins française',
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

  res.render('detailWine', {
    title: 'Ma cave à vins française',
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
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new CustomError(`Wine validation failed: ${errors.array().map(err => err.msg).join(', ')}`, 400))
    }
    const { wineName, wineYear, lifeMax, qtyEmpty, qtyFull, wineColor, region, appellation, producer } = req.body
    const wineId = req.params.wineId
    await db.updateWineDetail(wineName, wineYear, lifeMax, qtyEmpty, qtyFull, wineColor, region, appellation, producer, wineId)
    res.redirect('/wine')
  } catch(err) {
    next(err)
  }
})

const updateQtyPatch = asyncHandler(async(req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return next(new CustomError(`Wine validation failed: ${errors.array().map(err => err.msg).join(', ')}`, 400))
    }
    const { qtyFull } = req.body
    const wineId = req.params.wineId
    const wineDetail = await db.getWineDetail(wineId)
    let qtyEmpty = wineDetail.qty_empty
    const prevQtyFull = wineDetail.qty_full
    const qtyDifference = prevQtyFull - qtyFull
    if (qtyDifference > 0) {
      qtyEmpty = parseInt(qtyEmpty) + qtyDifference
    }
    await db.updateWineQuantity(qtyEmpty, qtyFull, wineId)
    res.redirect('/wine')
  } catch(err) {
    next(err)
  }
})

const deleteWineById = asyncHandler(async(req, res, next) => {
  const wineId = req.params.wineId

  if (!wineId) {
    return next(new CustomError(`No wine found with ID ${wineId}.`, 404))
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
