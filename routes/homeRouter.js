const { Router } = require('express')
const homeRouter = Router()
const homeController = require('../controllers/homeController')
const { validateWine } = require('../validations/wineValidation')

homeRouter.get('/', (req, res) => { res.render('home', { title: 'Mon cave' })})
homeRouter.get('/newWine', homeController.createWineGet)
homeRouter.post('/newWine', validateWine, homeController.createWinePost)

module.exports = homeRouter
