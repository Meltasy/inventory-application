const { Router } = require('express')
const wineRouter = Router()
const wineController = require('../controllers/wineController')
const { validateWine } = require('../validations/wineValidation')

// Returns '204 No Content' when browser requests favicon
wineRouter.get('/favicon.ico', (req, res) => res.status(204).end())
wineRouter.get('/', wineController.getWineList)
wineRouter.get('/:wineId', wineController.getWineById)
wineRouter.get('/:wineId/edit', wineController.updateWineGet)
wineRouter.put('/:wineId/edit', validateWine, wineController.updateWinePut)
wineRouter.delete('/:wineId/delete', wineController.deleteWineById)

module.exports = wineRouter
