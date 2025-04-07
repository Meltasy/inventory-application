const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const path = require('node:path')
const assetsPath = path.join(__dirname, 'public')
const homeRouter = require('./routes/homeRouter')
const wineRouter = require('./routes/wineRouter')

// app.get('/', (req, res) => res.send('My wine inventory app'))

app.listen(PORT, '0.0.0.0', () => {
  console.log(`My wine inventory app - listening on port ${PORT}!`)
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(expres.static(assetsPath))
app.use(express.urlencoded({ extended: true }))

app.use('/', homeRouter)
app.use('/wine', wineRouter)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.statusCode || 500).send(err)
})
