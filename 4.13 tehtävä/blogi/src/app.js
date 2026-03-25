import express from 'express'
import Blog from './blogstuff/blog.js'

const app = express()

app.use(express.json())

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  const { title, url } = req.body
  if (!title || !url) {
    return res.status(400).json({ error: 'title or url missing' })
  }
  const blog = new Blog(req.body)
  const savedBlog = await blog.save()
  res.status(201).json(savedBlog)
})

app.delete('/api/blogs/:_id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params._id)
    res.status(204).end()
  } catch (error) {
    res.status(400).json({ error: 'malformatted id'})
  }
})

export default app