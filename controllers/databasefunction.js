const database = require('../db/database.js')

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

//-------------------------------------------------------------------

const getTracksFromDatabase = (req, res) => {
  database.getAllTracks((err, tracks) => {
    if (err) {
      console.error('Error en getAllTracks:', err.message);
      res.status(500).json({ status: 'error', msg: 'Error al obtener los tracks desde la base de datos' })
    } else {
      res.status(200).json({ status: 'ok', data: tracks })
    }
  })
}

const getTrackByIdFromDB = (req, res) => {
  const { id } = req.params;
  database.getTrackById(id, (err, track) => {
    if (err) {
      return res.status(500).json({ status: 'error', msg: 'Error al buscar el track' })
    }
    if (!track) {
      return res.status(404).json({ status: 'error', msg: 'Track no encontrado' })
    }
    res.status(200).json({ status: 'ok', data: track })
  })
}

const updateTrackById = (req, res) => {
  const { id } = req.params;
  const { name, track_number } = req.body;

  database.updateTrack(id, name, track_number,  (err, result) => {
    if (err) {
      res.status(500).json({ status: 'error', msg: 'No se pudo actualizar el track' })
    } else if (!result.updated) {
      res.status(404).json({ status: 'error', msg: 'Track no encontrado' })
    } else {
      res.status(200).json({ status: 'ok', msg: 'Track actualizado correctamente' })
    }
  })
}

const deleteTrackById = (req, res) => {
  const { id } = req.params;

  database.deleteTrack(id, (err, result) => {
    if (err) {
      res.status(500).json({ status: 'error', msg: 'No se pudo eliminar el track' })
    } else if (!result.deleted) {
      res.status(404).json({ status: 'error', msg: 'Track no encontrado' })
    } else {
      res.status(200).json({ status: 'ok', msg: 'Track eliminado correctamente' })
    }
  })
}

module.exports = {
    getAlbumsFromDatabase,
    getAlbumPorIdFromDB,
    updateAlbumById,
    deleteAlbumById,
    getArtistasFromDatabase,
    getArtistaPorIdFromDB,
    updateArtistaById,
    deleteArtistaById,
    getTracksFromDatabase,
    getTrackByIdFromDB,
    updateTrackById,
    deleteTrackById
}