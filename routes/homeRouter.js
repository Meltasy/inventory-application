const { Router } = require('express')
const homeRouter = Router()
const homeController = require('../controllers/homeController')
const { validateNewWine } = require('../validations/wineValidation')

homeRouter.get('/', homeController.getMaxLifeWineList)
homeRouter.get('/newWine', homeController.createWineGet)
homeRouter.post('/newWine', validateNewWine, homeController.createWinePost)

module.exports = homeRouter
