const { Router } = require('express')
const typeRouter = Router()
const typeController = require('../controllers/typeController')

typeRouter.get('/', (req, res) => {
  return res.render('allTypes', { 
    title: 'Wine by type',
    subtitle: 'Choose a color for your wine.',
    colorWineList: []
  })})
  typeRouter.get('/search', typeController.getColorWineList)

module.exports = typeRouter
