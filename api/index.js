const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const express = require('express')
const { join } = require('path')
const app = express()

app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({
  extended: true,
  limit: "50mb"
}))
app.use(cookieParser())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE")
  res.header("Access-Control-Allow-Headers", "origin, content-type, Authorization")
  res.header("Content-Type", "application/json")
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next()
  }
})

// Data route
const dataFolder = join(__dirname, '..', 'data')
app.use("/data", express.static(dataFolder))

// API routes
const apiRoutes = express.Router()
apiRoutes.use('/user', require('./controller/user-controller'))
apiRoutes.use('/face', require('./controller/face-controller'))
app.use('/api', apiRoutes)

module.exports = {
  path: '/',
  handler: app
}
