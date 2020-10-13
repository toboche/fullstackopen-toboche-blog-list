const app = require('./app') // the actual Express application
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

const server = http.createServer(app)

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

// const http = require('http')
// const express = require('express')
// const app = express()
// const cors = require('cors')
// const mongoose = require('mongoose')
// require('dotenv').config()


// const mongoUrl = process.env.MONGODB_URI
// mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

// app.use(cors())
// app.use(express.json())

// const PORT = 3003
// app.listen(PORT, () => {
//   logger.info(`Server running on port ${PORT}`)
// })