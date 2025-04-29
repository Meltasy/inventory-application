const { Router } = require('express')
const wineRouter = Router()
const wineController = require('../controllers/wineController')
const { validateEditWine, validateQuantity } = require('../validations/wineValidation')

// Returns '204 No Content' when browser requests favicon
wineRouter.get('/favicon.ico', (req, res) => res.status(204).end())
wineRouter.get('/', wineController.getWineList)
wineRouter.get('/:wineId', wineController.getWineById)
wineRouter.get('/:wineId/edit', wineController.updateWineGet)
wineRouter.put('/:wineId/edit', validateEditWine, wineController.updateWinePut)
wineRouter.patch('/:wineId/quantity', validateQuantity, wineController.updateQtyPatch)
wineRouter.delete('/:wineId/delete', wineController.deleteWineById)

module.exports = wineRouter
