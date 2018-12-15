const api = require('./').handler
const consola = require('consola')

let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

const host = config.env.HOST || 'localhost'
const port = config.env.PORT_API || 3001

// Listen the server
api.listen(port, host)
consola.ready({
  message: `API listening on http://${host}:${port}`,
  badge: true
})
