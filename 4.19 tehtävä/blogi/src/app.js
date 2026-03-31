import express from 'express'
import Blog from './blogstuff/blog.js'
import usersRouter from '../models/users.js'
import loginRouter from '../models/login.js'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'


const app = express()

app.use(express.json())
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

const getTokenFrom = req => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  const { title, author, url, likes } = req.body
  if (!title || !url) {
    return res.status(400).json({ error: 'title or url missing' })
  }
  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

  if (!user) {
    return res.status(400).json({ error: 'no user found to set as blog creator' })
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id
  })

  const savedBlog = await blog.save()
  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
  res.status(201).json(populatedBlog)
})

app.delete('/api/blogs/:_id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params._id)
  res.status(204).end()
})

app.put('/api/blogs/:_id', async (req, res) => {
  const { title, author, url, likes } = req.body

  const updatedBlog = {
    title,
    author,
    url,
    likes
  }

  const result = await Blog.findByIdAndUpdate(
    req.params._id,
    updatedBlog,
    { returnDocument: 'after',
      runValidators: true }
  )

  res.json(result)
})

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