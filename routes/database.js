const { Router } = require('express')
const { getAlbumsFromDatabase, getAlbumPorIdFromDB,updateAlbumById, deleteAlbumById, 
        getArtistaPorIdFromDB, getArtistasFromDatabase, updateArtistaById, deleteArtistaById,
        getTracksFromDatabase, getTrackByIdFromDB, updateTrackById, deleteTrackById} = require('../controllers/databasefunction')

const rutas = Router()

//----------------------[DB Endpoints]-----------------------------------
rutas.get('/albums/show', getAlbumsFromDatabase)
rutas.get('/albums/:id', getAlbumPorIdFromDB)
rutas.put('/albums/:id', updateAlbumById)   
rutas.delete('/albums/:id', deleteAlbumById)

rutas.get('/artists/show', getArtistasFromDatabase)
rutas.get('/artists/:id', getArtistaPorIdFromDB)
rutas.put('/artists/:id', updateArtistaById)
rutas.delete('/artists/:id', deleteArtistaById)

rutas.get('/tracks/show', getTracksFromDatabase)
rutas.get('/tracks/:id', getTrackByIdFromDB)
rutas.put('/tracks/:id', updateTrackById)
rutas.delete('/tracks/:id', deleteTrackById)

rutas.use((req,res) =>{
    res.status(404).json({status: 'error', message: 404})
})

module.exports = rutas