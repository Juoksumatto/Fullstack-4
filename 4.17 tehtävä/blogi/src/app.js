import express from 'express'
import Blog from './blogstuff/blog.js'
import usersRouter from '../models/users.js'
import User from '../models/user.js'

const app = express()

app.use(express.json())
app.use('/api/users', usersRouter)

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  const { title, author, url, likes } = req.body
  if (!title || !url) {
    return res.status(400).json({ error: 'title or url missing' })
  }

  const user = await User.findOne({})
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
  try {
    await Blog.findByIdAndDelete(req.params._id)
    res.status(204).end()
  } catch (error) {
    res.status(400).json({ error: 'wrong id'})
  }
})

app.put('/api/blogs/:_id', async (req, res) => {
  const { title, author, url, likes } = req.body

  const updatedBlog = {
    title,
    author,
    url,
    likes
  }

  try {
    const result = await Blog.findByIdAndUpdate(
      req.params._id,
      updatedBlog,
      { returnDocument: 'after',
       runValidators: true }
    )

    res.json(result)
  } catch (error) {
    res.status(400).json({ error: 'wrong id' })
  }
})

export default app