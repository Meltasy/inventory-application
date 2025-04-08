const { Router } = require('express')
const homeRouter = Router()
const homeController = require('../controllers/homeController')

homeRouter.get('/', homeController.getWineList)
homeRouter.get('/newWine', homeController.createWineGet)
homeRouter.post('/newWine', homeController.createWinePost)
homeRouter.get('/:wineId', homeController.getWineById)

module.exports = homeRouter;
