const { Router } = require('express')
const homeRouter = Router()
const homeController = require('../controllers/homeController')

homeRouter.get('/', homeController.getWineList)
homeRouter.get('/newWine', homeController.createWineGet)
homeRouter.post('/newWine', homeController.createWinePost)

module.exports = homeRouter;
