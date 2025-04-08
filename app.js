require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const path = require('node:path')
const assetsPath = path.join(__dirname, 'public')
const homeRouter = require('./routes/homeRouter')
// const wineRouter = require('./routes/wineRouter')

app.listen(PORT, '0.0.0.0', () => {
  console.log(`My wine inventory app - listening on port ${PORT}!`)
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static(assetsPath))
app.use(express.urlencoded({ extended: true }))

app.use('/', homeRouter)
// app.use('/wine', wineRouter)

app.use((req, res) => {
  console.log('Rendering notFound with message: ', message)
  res.status(404).render('notFound', {
    message: 'Page not found'
  })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.statusCode || 500).render('error', {
    message: err.message || 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err : null
  })
})
