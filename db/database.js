const sqlite3 = require('sqlite3').verbose()

class Database {
  constructor() {
    this.db = new sqlite3.Database('./db/database.db' ,(err) => {
      if (err) {
        console.error('Error al conectar con la base de datos:', err.message)
      } else {
        console.log('Conectado a la base de datos SQLite.')
      }
    })
    this.createTables()
  }

  createTables() { 
    const queries = [
      `CREATE TABLE IF NOT EXISTS artistas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        SpotifyIdArtist TEXT NOT NULL UNIQUE, 
        nombre TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS albums (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        release_date TEXT NOT NULL,
        artists TEXT NOT NULL,
        image TEXT UNIQUE,
        total_tracks INTEGER,
        SpotifyIdAlbum TEXT NOT NULL UNIQUE
      )`,
      `CREATE TABLE IF NOT EXISTS tracks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        SpotifyIdTrack TEXT NOT NULL UNIQUE,
        track_number INT NOT NULL 
      )`
    ]

    queries.forEach((query) => {
      this.db.run(query, (err) => {
        if (err) {
          console.error('Error al crear la tabla:', err.message)
        } else {
          console.log('Tabla creada o ya existente.')
        }
      })
    })
  }
  //----------------------------[INSERTS]-------------------------------------
  //Funcion para insertar id y artista de '/search'
  insertArtista(nombre, id) {
    const sql = `INSERT INTO artistas (SpotifyIdArtist, nombre) VALUES (?, ?)`
    this.db.run(sql, [id, nombre],  (err) => {
      if (err) {
        console.error('Error al insertar el artista:', err.message)
      } else {
        console.log(`Artista ${nombre} (${id}) guardado en la base de datos.`)
  
        // Mostrar todos los artistas después de insertar
        
        this.db.all(`SELECT * FROM artistas`, [], (err, rows) => {
          if (err) {
            console.error('Error al obtener todos los artistas:', err.message)
          } else {
            console.log('Lista de artistas en la base de datos:')
            console.table(rows)
          }
        })
      }
    })
  }

  verificarArtistaExistente(id, callback) {
    this.db.get('SELECT * FROM artistas WHERE SpotifyIdArtist = ?', [id], (err, row) => {
      if (err) {
        console.error('Error al consultar la base de datos', err)
        return callback(null)
      }
      callback(row)
    })
  }

  //Procedimiento para almacenar los albunes de '/:id/albums'
  insertAlbum(name, release_date, artists,image, total_tracks,id) {
    const sql = `
      INSERT INTO albums (name, release_date, artists, image, total_tracks, SpotifyIdAlbum)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    const artistsString = JSON.stringify(artists)

    this.db.run(sql, [name, release_date, artistsString, image, total_tracks, id], function (err) {
      if (err) {
        console.error('Error al insertar álbum:', err.message)
      } else if (this.changes === 0) {
        console.log(`Álbum "${name}" ya existe. No se insertó.`)
      }
    })
  }

  insertTrack(name, id, track_number) {
    const sql = `
      INSERT INTO tracks (name, SpotifyIdTrack, track_number)
      VALUES (?,?,?)
    `
    this.db.run(sql, [name, id, track_number], (err) => {
      if (err) {
        console.error('Error al insertar track:', err.message)
      } else {
        //console.log("track guardado")
      }
    })
  }
  //---------------------------[GETTERS]---------------------------------

  getAllAlbums(callback) {
    const sql = 'SELECT * FROM albums'
    let data = {array: []}
  
    this.db.all(sql, [], (err, rows) => {
      if (err) {
        return callback(err)
      }   
      try {
        data.array = rows.map(row => ({
          id: row.id,
          name: row.name,
          release_date: row.release_date,
          artists: JSON.parse(row.artists),
          image: row.image,
          total_tracks: row.total_tracks,
          SpotifyIdAlbum: row.SpotifyIdAlbum
        }))
        callback(null, data)
      } catch (e) {
        callback(e)
      }
    })
  }

  getAlbumById(id,callback){
    const sql = `SELECT * FROM albums WHERE id = ?`

    this.db.get(sql, [id], (err, row) => {
      if (err) {
        console.error('Error al obtener el album:', err.message)
        callback(err);
      }
      if (!row) {
        // No se encontró ningún album con ese ID
        return callback(null, null)
      }
  
      const data = {
        id: row.id,
        name: row.name,
        release_date: row.release_date,
        artists: JSON.parse(row.artists),
        image: row.image,
        total_tracks: row.total_tracks
      }
      callback(null, data)    
    })
  }

  getAllArtistas(callback) {
    const sql = 'SELECT * FROM artistas'
    let data = { array: [] }
  
    this.db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Error al obtener los artistas:', err.message)
        callback(err)
      }
  
      data.array = rows.map(row => ({
        id: row.id,
        SpotifyIdArtist: row.SpotifyIdArtist,   
        nombre: row.nombre
      }))

      callback(null, data)
    })
  }

  getArtistaById(id, callback) {
    const sql = `SELECT * FROM artistas WHERE id = ?`

    this.db.get(sql, [id], (err, row) => {
      if (err) {
        console.error('Error al obtener el artista:', err.message)
        callback(err);
      }
      if (!row) {
        // No se encontró ningún artista con ese ID
        return callback(null, null)
      }
  
      const data = {
        id: row.id,
        SpotifyIdArtist: row.SpotifyIdArtist,
      }

      callback(null, data)  
    })
  }

    getAllTracks(callback) {
      const sql = 'SELECT * FROM tracks'
      let data = { array: [] }
    
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          console.error('Error al obtener los tracks:', err.message)
          callback(err)
        }  
        data.array = rows.map(row => ({
          id: row.id,
          name: row.name,   
          track_number: row.track_number,
          SpotifyIdTrack: row.SpotifyIdTrack
        }))
        callback(null, data)
      })
    }

    getTrackById(id ,callback) {
      const sql = 'SELECT * FROM tracks WHERE id = ?'
      let data = { array: [] }
    
      this.db.all(sql, [id], (err, rows) => {
        if (err) {
          console.error('Error al obtener los tracks:', err.message)
          callback(err)
        }
        if (!rows) {
          // No se encontró ningún track con ese ID
          return callback(null, null)
        }
        data.array = rows.map(row => ({
          id: row.id,
          name: row.name,   
          track_number: row.track_number,
          SpotifyIdTrack: row.SpotifyIdTrack
        }))
        callback(null, data)
      })
    }

  //---------------------------[UPDATE]---------------------------------
  updateAlbum(id, name, release_date, artists, image, total_tracks, callback) {
    const sql = `
      UPDATE albums
      SET name = ?, release_date = ?, artists = ?, image = ?, total_tracks = ?
      WHERE id = ?
    `
    const artistsString = JSON.stringify(artists)
    this.db.run(sql, [name, release_date, artistsString, image, total_tracks, id], function (err) {
      if (err) {
        console.error('Error al actualizar la tabla albums:', err.message)
        callback(err)
      } else {
        callback(null, { updated: this.changes > 0 })
      }
    })
  }

  updateArtist(id, nombre, callback) {
    const sql = `
      UPDATE artistas
      SET nombre = ?
      WHERE id = ?
    `
    this.db.run(sql,[nombre, id], function (err) {
      if (err) {
        console.error('Error al actualizar la tabla artistas:', err.message);
        callback(err);
      }
      else {
        callback(null, {updated: this.changes > 0})
      }
    })
  }

  updateTrack(name,id,track_number,callback) {
    const sql = `
     UPDATE tracks
     SET name = ? , track_number = ?
     WHERE id = ?
    `

    this.db.run(sql, [name,track_number,id], (err) => {
      if (err) {
        console.error('Error al actualizar la tabla tracks:', err.message);
        callback(err);
      }
      else {
        callback(null, {updated: this.changes > 0})
      }
    })
  }
  
  //---------------------------[DELETE]---------------------------------
  deleteAlbum(id, callback) {
    const sql = `DELETE FROM albums WHERE id = ?`
    this.db.run(sql, [id], function (err) {
      if (err) {
        console.error('Error al eliminar la tabla albums:', err.message)
        callback(err)
      } else {
        callback(null, { deleted: this.changes > 0 })
      }
    })
  }

  deleteArtista(id,callback) {
    const sql = `DELETE FROM artistas WHERE id = ?`
    this.db.run(sql, [id], function (err) {
      if (err) {
        console.error('Error al eliminar la tabla artistas:', err.message)
        callback(err)
      } else {
        callback(null, { deleted: this.changes > 0 })
      }
    })
  }

  deleteTrack(id, callback) {
    const sql = `DELETE FROM tracks WHERE id = ?`
    this.db.run(sql, [id], function (err) {
      if (err) {
        console.error('Error al eliminar la tabla tracks:', err.message)
        callback(err)
      } else {
        callback(null, { deleted: this.changes > 0 })
      }
    })
  }
//----------------------------------------------------------------------------
  getConnection() {
    return this.db
  }

  closeDatabase() {
    this.db.close((err) => {
      if (err) {
        console.error('Error al cerrar la base de datos:', err.message)
      } else {
        console.log('Conexión con SQLite cerrada.')
      }
    })
  }
}

module.exports = new Database()
