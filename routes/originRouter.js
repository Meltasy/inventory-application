const { Router } = require('express')
const originRouter = Router()
const originController = require('../controllers/originController')

originRouter.get('/', originController.getOriginWineList)
originRouter.get('/search', originController.getEachOriginWineList)

module.exports = originRouter
