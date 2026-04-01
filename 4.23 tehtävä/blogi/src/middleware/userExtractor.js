import jwt from 'jsonwebtoken'
import User from '../../models/user.js'

const userExtractor = async (req, res, next) => {
  req.user = null

  if (!req.token) {
    return next()
  }

  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken.id) {
      return next()
    }

    req.user = await User.findById(decodedToken.id)
  } catch (error) {
    req.user = null
  }

  next()
}

export default userExtractor
