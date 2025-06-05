const { getAccessToken } = require('../models/auth')
const axios = require('axios')
const database = require('../db/database.js')

const getArtistaPorNombre = async (req, res) => {
  const { q } = req.query
  try {
    const token = await getAccessToken()
    const response = await axios.get(`https://api.spotify.com/v1/search?q=${q}&type=artist`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const artista = response.data.artists.items[0] // Tomamos solo el primer artista

    if (artista) {
      const resultado = {
        nombre: artista.name,
        id: artista.id
      }
      // Guardamos el artista en la base de datos
      database.verificarArtistaExistente(resultado.id, (existingArtista) => {
        if (!existingArtista) {
          database.insertArtista(resultado.nombre, resultado.id)
        } else {
          console.log(`El artista "${resultado.nombre}" ya existe en la base de datos`)
        }
      })

      res.status(200).json({ status: 'ok', data: resultado })
    }
  } catch (error) {
    res.status(500).json({ status: 'error', msg: 'Error inesperado al obtener la información' })
  }
}

const getArtistaPorId = async (req, res) => {
  const { id } = req.params
  try {
    const token = await getAccessToken()
    const response = await axios.get(`https://api.spotify.com/v1/artists/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    const { name, id: artistId, popularity, genres, followers } = response.data

    // Guardamos el artista en la base de datos
    database.insertArtistaDetalle(name, artistId, popularity, genres, followers.total)

    res.status(200).json({ status: 'ok', data: { name, id: artistId, popularity, genres, followers } })
  } catch (error) {
    res.status(500).json({ status: 'error', msg: 'Error inesperado al obtener la información' })
  }
}

const getTodosLosAlbunesDelArtista = async (req, res) => {
  const { id } = req.params
  try {
    const token = await getAccessToken()
    const response = await axios.get(`https://api.spotify.com/v1/artists/${id}/albums`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const albums = response.data.items.map(album => ({
      name: album.name,
      release_date: album.release_date,
      artists: album.artists.map(artist => artist.name),
      total_tracks: album.total_tracks,
      image: album.images?.[0]?.url || null,
      id: album.id //id del album
    }))

    //Guardamos los albumes en la base de datos
    albums.forEach(album => {
      database.insertAlbum(album.name, album.release_date, album.artists, album.image, album.total_tracks)
    })
    console.log(albums)
    res.status(200).json({ status: 'ok', data: albums })
  } catch (error) {
    console.error('Error al obtener los álbumes:', error.message);
    res.status(500).json({ status: 'error', msg: 'Error inesperado al obtener la información' })
  }
}

module.exports = {
  getArtistaPorNombre,
  getArtistaPorId,
  getTodosLosAlbunesDelArtista
}
