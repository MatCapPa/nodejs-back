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
      image: album.images?.[0]?.url || null
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

//-------------------------------[DataBase functions]----------------------------------------------------
const getArtistasFromDatabase = (req, res) => {
  database.getAllArtistas((err, artistas) => {
    if (err) {
      console.error('Error real desde database:', err.message);
      return res.status(500).json({status: 'error', msg: 'Error inesperado al obtener la información', error: err.message })
    }
    //console.log('Artistas encontrados:', artistas)
    res.status(200).json({ status: 'ok', data: artistas })
  })
}

const getArtistaPorIdFromDB = (req, res) => {
  const { id } = req.params;
  database.getArtistaById(id, (err, artista) => {
    if (err) {
      return res.status(500).json({ status: 'error', msg: 'Error al buscar artista' })
    }
    if (!artista) {
      return res.status(404).json({ status: 'error', msg: 'Artista no encontrado' })
    }
    res.status(200).json({ status: 'ok', data: artista })
  })
}

const updateArtistaById = (req, res) => {
  const { id } = req.params
  const { nombre } = req.body


  database.updateArtist(id,nombre, (err, result) => {
    if (err) {
      res.status(500).json({ status: 'error', msg: 'No se pudo actualizar la tabla' })
    } else if (!result.updated) {
      res.status(404).json({ status: 'error', msg: 'Tabla no encontrado' })
    } else {
      res.status(200).json({ status: 'ok', msg: 'Tabla actualizado correctamente' })
    }
  })
}

const deleteArtistaById = (req, res) => {
  const  {id} = req.params

  database.deleteArtista(id,(err,result) => {
    if (err) {
      res.status(500).json({ status: 'error', msg: 'No se pudo eliminar la tabla' })
    } else if (!result.deleted) {
      res.status(404).json({ status: 'error', msg: 'Tabla no encontrado' })
    } else {
      res.status(200).json({ status: 'ok', msg: 'Tabla eliminado correctamente' })
    }
  }) 
}

//-------------------------------------------------------------------

const getAlbumsFromDatabase = (req, res) => {
  database.getAllAlbums((err, albumes) => {
    if (err) {
      console.error('Error en getAllAlbums:', err.message);
      res.status(500).json({ status: 'error', msg: 'Error al obtener los álbumes desde la base de datos' })
    } else {
      res.status(200).json({ status: 'ok', data: albumes })
    }
  })
}

const getAlbumPorIdFromDB = (req, res) => {
  const { id } = req.params;
  database.getAlbumById(id, (err, album) => {
    if (err) {
      return res.status(500).json({ status: 'error', msg: 'Error al buscar album' })
    }
    if (!album) {
      return res.status(404).json({ status: 'error', msg: 'Album no encontrado' })
    }
    res.status(200).json({ status: 'ok', data: album })
  })
}

const updateAlbumById = (req, res) => {
  const { id } = req.params;
  const { name, release_date, artists, image, total_tracks } = req.body;

  database.updateAlbum(id, name, release_date, artists, image, total_tracks,  (err, result) => {
    if (err) {
      res.status(500).json({ status: 'error', msg: 'No se pudo actualizar el álbum' })
    } else if (!result.updated) {
      res.status(404).json({ status: 'error', msg: 'Álbum no encontrado' })
    } else {
      res.status(200).json({ status: 'ok', msg: 'Álbum actualizado correctamente' })
    }
  })
}

const deleteAlbumById = (req, res) => {
  const { id } = req.params;

  database.deleteAlbum(id, (err, result) => {
    if (err) {
      res.status(500).json({ status: 'error', msg: 'No se pudo eliminar el álbum' })
    } else if (!result.deleted) {
      res.status(404).json({ status: 'error', msg: 'Álbum no encontrado' })
    } else {
      res.status(200).json({ status: 'ok', msg: 'Álbum eliminado correctamente' })
    }
  })
}


module.exports = {
  getArtistaPorNombre,
  getArtistaPorId,
  getTodosLosAlbunesDelArtista,

  getAlbumsFromDatabase,
  getAlbumPorIdFromDB,
  updateAlbumById,
  deleteAlbumById,
  getArtistasFromDatabase,
  getArtistaPorIdFromDB,
  updateArtistaById,
  deleteArtistaById
}
