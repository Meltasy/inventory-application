const { Router } = require('express')
const originRouter = Router()
const originController = require('../controllers/originController')
const { validateSearch } = require('../validations/wineValidation')

originRouter.get('/', originController.getOriginWineList)
originRouter.get('/search', originController.getEachOriginWineList)
originRouter.get('/search/producer', validateSearch, originController.getProducerWineList)

module.exports = originRouter
