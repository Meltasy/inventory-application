const { Router } = require('express')
const originRouter = Router()
const originController = require('../controllers/originController')

originRouter.get('/', originController.getOriginWineList)
originRouter.get('/serach', originController.getEachOriginWineList)

module.exports = originRouter
