const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => { //next -- который позволяет продолжить выполнение запроса
  if (req.method === 'OPTIONS') {
    return next()
  }

  try {

    const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"
    // у хедеров есть специальное поле которое называеться authorization

    if (!token) {
      return res.status(401).json({ message: `Нет авторизации ${token}` })
    }

    const decoded = jwt.verify(token, config.get('jwtSecret')) // раскодируем токен
    req.user = decoded
    next()

  } catch (e) {
    res.status(401).json({ message: `Нет авторизации ${e}` })
  }
}
