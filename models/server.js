const express = require('express')
const cors = require('cors')
const database = require('../db/database.js')

class Server {
  constructor () {
    this.app = express()
    this.port = process.env.PORT || 3000
    this.middleware()
    this.rutas()
    this.db = database.getConnection()
  }

  middleware () {
    this.app.use(cors())
    this.app.use(express.static('public'))
    this.app.use(express.json())
  }

  rutas () {
    this.app.use('/api', require('../routes/artistas'))
  }

  listen () {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en el puerto ${this.port}`)
    })

    process.on('SIGINT', () => {
      database.closeDatabase()
      process.exit()
    })
  }  
}

module.exports = Server