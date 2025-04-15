const { Router } = require('express')
const typeRouter = Router()
const typeController = require('../controllers/typeController')

typeRouter.get('/', typeController.getTypeWineList)
typeRouter.get('/search', typeController.getEachTypeWineList)

module.exports = typeRouter
