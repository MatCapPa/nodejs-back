const { getAccessToken } = require('../models/auth')
const axios = require('axios')


const getTracksforAlbum = async (req, res) => {
    const { id } = req.params
    try {
        const token = await getAccessToken()
            const response = await axios.get(`https://api.spotify.com/v1/albums/${id}/tracks`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
            })
            //track_number, name y id
            const tracks = response.data.items.map(track =>({
                name: track.name,
                id: track.id,
                track_number: track.track_number
            }))
   
        res.status(200).json({ status: 'ok', data: tracks })
    } catch (error) {
        res.status(500).json({ status: 'error', msg: 'Error inesperado al obtener la información' })
  }
}

module.exports = {
    getTracksforAlbum
}