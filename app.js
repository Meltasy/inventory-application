require('dotenv').config()
const express = require('express')
const methodOverride = require('method-override')
const app = express()
const PORT = process.env.PORT || 3000
const path = require('node:path')
const assetsPath = path.join(__dirname, 'public')
const homeRouter = require('./routes/homeRouter')
const wineRouter = require('./routes/wineRouter')
const typeRouter = require('./routes/typeRouter')
const originRouter = require('./routes/originRouter')
const CustomError = require('./errors/CustomError')

app.listen(PORT, '0.0.0.0', () => {
  console.log(`My wine inventory app - listening on port ${PORT}!`)
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(assetsPath))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use('/', homeRouter)
app.use('/wine', wineRouter)
app.use('/type', typeRouter)
app.use('/origin', originRouter)

app.locals.getWineColor = function(wineColor) {
  const colorMap = {
    'rouge' : '#641c27',
    'blanc' : '#e1e488',
    'rosé' : '#f18e8e',
    'effervescent' : '#dacd7b'
  }
  return colorMap[wineColor]
}

app.use((req, res, next) => {
  next(new CustomError('Page not found.', 404))
})

app.use((err, req, res, next) => {
  console.error(err)

  if (err instanceof CustomError) {
    return res.status(err.statusCode).render('error', {
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err : null
    })
  }

  res.status(err.statusCode || 500).render('error', {
    message: err.message || 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err : null
  })
})
