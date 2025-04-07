const { Router } = require('express')
const homeRouter = Router()

homeRouter.get('/', (req, res) => req.send('Home'))

module.exports = homeRouter;
