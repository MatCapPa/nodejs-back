const { Router } = require('express')
const { getArtistaPorNombre, getTodosLosAlbunesDelArtista} = require('../controllers/artistas')
const { getTracksforAlbum } = require('../controllers/tracks')

const rutas = Router()

// devuelve el id del artista ej: /search?q=eminem
rutas.get('/search', getArtistaPorNombre) 
// devuelve una lista de los albunes donde participo el artista ej: /1HY2Jd0NmPuamShAr6KMms/albums  <-- ese id es de Lady Gaga  
rutas.get('/:id/albums', getTodosLosAlbunesDelArtista)

rutas.get('/albums/tracks/:id', getTracksforAlbum) // devuelve las canciones de un album ej album MAYHEM: /albums/tracks/2MHUaRi9OCyTN02SoyRRBJ

rutas.use((req,res) =>{
    res.status(404).json({status: 'error', message: 404})
})

module.exports = rutas
