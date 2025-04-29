const { Router } = require('express')
const homeRouter = Router()
const homeController = require('../controllers/homeController')
const { validateNewWine } = require('../validations/wineValidation')

homeRouter.get('/', (req, res) => { res.render('home', { title: 'Ma cave à vins française' })})
homeRouter.get('/newWine', homeController.createWineGet)
homeRouter.post('/newWine', validateNewWine, homeController.createWinePost)

module.exports = homeRouter
