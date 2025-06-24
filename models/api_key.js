function validarApiKey(req, res, next) {
  const clientKey = req.headers['x-api-key'];
  if (clientKey !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Acceso denegado: API Key inválida' });
  }
  next();
}

module.exports = validarApiKey;