const { Router } = require('express')
const { getArtistaPorNombre, getTodosLosAlbunesDelArtista, getArtistaPorId,
    getAlbumsFromDatabase, getAlbumPorIdFromDB,updateAlbumById, deleteAlbumById, 
    getArtistaPorIdFromDB, getArtistasFromDatabase, updateArtistaById, deleteArtistaById } = require('../controllers/artistas')

const rutas = Router()

rutas.get('/search', getArtistaPorNombre) // devuelve el id del artista ej: /search?q=eminem
rutas.get('/:id/albums', getTodosLosAlbunesDelArtista) // devuelve una lista de los albunes donde participo el artista ej: /1HY2Jd0NmPuamShAr6KMms/albums
rutas.get('/:id', getArtistaPorId) // devuelve info del artista ej: /artist/1HY2Jd0NmPuamShAr6KMms  <-- ese id es de Lady Gaga

//----------------------[DB Endpoints]-----------------------------------

rutas.get('/albums/show', getAlbumsFromDatabase)
rutas.get('/albums/:id', getAlbumPorIdFromDB)
rutas.put('/albums/:id', updateAlbumById)   
rutas.delete('/albums/:id', deleteAlbumById)
rutas.get('/artists/show', getArtistasFromDatabase)
rutas.get('/artists/:id', getArtistaPorIdFromDB)
rutas.put('/artists/:id', updateArtistaById)
rutas.delete('/artists/:id', deleteArtistaById)

module.exports = rutas
