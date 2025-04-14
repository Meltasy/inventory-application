const { Router } = require('express')
const typeRouter = Router()
const typeController = require('../controllers/typeController')

typeRouter.get('/', typeController.getTypeWineList)
typeRouter.get('/search', typeController.getColorWineList)

module.exports = typeRouter
