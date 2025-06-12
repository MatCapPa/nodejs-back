const { Router } = require('express')
const { getArtistaPorNombre, getTodosLosAlbunesDelArtista, getArtistaPorId} = require('../controllers/artistas')
const { getTracksforAlbum } = require('../controllers/tracks')

const rutas = Router()

rutas.get('/search', getArtistaPorNombre) // devuelve el id del artista ej: /search?q=eminem
rutas.get('/:id/albums', getTodosLosAlbunesDelArtista) // devuelve una lista de los albunes donde participo el artista ej: /1HY2Jd0NmPuamShAr6KMms/albums
rutas.get('/:id', getArtistaPorId) // devuelve info del artista ej: /artist/1HY2Jd0NmPuamShAr6KMms  <-- ese id es de Lady Gaga

rutas.get('/albums/tracks/:id', getTracksforAlbum) // devuelve las canciones de un album ej album MAYHEM: /albums/tracks/2MHUaRi9OCyTN02SoyRRBJ

rutas.use((req,res) =>{
    res.status(404).json({status: 'error', message: 404})
})

module.exports = rutas
