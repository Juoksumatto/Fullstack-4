import express from 'express'
import Blog from './blog.js'
import userExtractor from '../middleware/userExtractor.js'

const blogsRouter = express.Router()

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1
  })
  res.json(blogs)
})

blogsRouter.post('/', userExtractor, async (req, res) => {
  const user = req.user

  if (!user) {
    return res.status(401).json({ error: 'unauthorized'})
  }

  const blogData = {
    ...req.body,
    user: user._id
  }


  const blog = new Blog(blogData)
  const savedBlog = await blog.save()
  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const user = req.user
  const blog = await Blog.findById(req.params.id)

  if (!blog) {
    return res.status(404).json({ error: 'blog not found' })
  }

  if (blog.user && !user) {
    return res.status(401).json({ error: 'token invalid' })
  }

  if (blog.user && user && blog.user.toString() !== user._id.toString()) {
    return res.status(403).json({ error: 'unauthorized' })
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body

  const updatedBlog = {
    title,
    author,
    url,
    likes
  }

  const result = await Blog.findByIdAndUpdate(
    req.params.id,
    updatedBlog,
    {
      returnDocument: 'after',
      runValidators: true
    }
  )

  if (!result) {
    return res.status(404).json({ error: 'blog not found' })
  }

  res.json(result)
})

export default blogsRouter