const { Router } = require('express')
const { getWineById } = require('../controllers/wineController')
const wineRouter = Router()

wineRouter.get('/', (req, res) => req.send('All wines'))
wineRouter.get('/:wineId', (req, res) => {
  const { wineId } = req.params;
  res.send(`Wine ID: ${wineId}`)
})
wineRouter.get('/:wineId', getWineById)

module.exports = wineRouter;
