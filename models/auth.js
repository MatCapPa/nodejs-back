const axios = require('axios')
const qs = require('qs')

// Variables para almacenar el token de acceso y su tiempo de expiración
let accessToken = null
let tokenExpirationTime = null

// Función para obtener el token de acceso desde la API de Spotify
const getAccessToken = async () => {
  if (accessToken && tokenExpirationTime && Date.now() < tokenExpirationTime) {
    return accessToken // Si el token es válido, retornamos el token actual
  }

  // Si no hay token o ha expirado, solicitamos uno nuevo
  const clientId = process.env.CLIENT_ID
  const clientSecret = process.env.CLIENT_SECRET

  const response = await axios.post(
    'https://accounts.spotify.com/api/token',
    qs.stringify({ grant_type: 'client_credentials' }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      }
    }
  )

  accessToken = response.data.access_token
  tokenExpirationTime = Date.now() + response.data.expires_in * 1000
  console.log('Token expiration time: ' + new Date(tokenExpirationTime).toLocaleString())

  return accessToken
}

module.exports = { getAccessToken }
