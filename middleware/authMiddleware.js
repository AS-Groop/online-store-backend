const jwt = require('jsonwebtoken')
module.exports = function (req, res, next) {
  if (req.method === 'OPTION') {
    next()
  }
  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      return res.status(401).json({message: "Не авторезован"})
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY)
    console.log(decode, req.user)
    req.user = decode
    next()
  } catch (e) {
    res.status(401).json({message: "Не авторезован"})
  }
}