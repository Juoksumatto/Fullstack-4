import express from 'express'
import usersRouter from '../models/users.js'
import loginRouter from '../models/login.js'
import blogsRouter from './blogstuff/blogs.js'
import tokenExtractor from './middleware/tokenExtractor.js'

const app = express()

app.use(express.json())
app.use('/api/blogs', tokenExtractor, blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }

  next(error)
}

app.use(errorHandler)

export default app