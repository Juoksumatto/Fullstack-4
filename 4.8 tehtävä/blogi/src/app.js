import express from 'express'
import Blog from './blogstuff/blog.js'

const app = express()

app.use(express.json())

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  const blog = new Blog(req.body)
  const savedBlog = await blog.save()
  res.status(201).json(savedBlog)
})

export default app