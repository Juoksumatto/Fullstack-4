import { test, describe, beforeEach, after, before } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'

import config from '../src/mongod.js'
import app from '../src/app.js'
import Blog from '../src/blogstuff/blog.js'

before(async () => {
    await mongoose.connect(config.MONGO_URI)
})

const api = supertest(app)

const initialBlogs = [
  {
    title: 'this a blog',
    author: 'Onni',
    url: 'https://github.com/Juoksumatto/Fullstack-4',
    likes: 5
  },
  {
    title: 'blog 2',
    author: 'Onni',
    url: 'https://github.com/Juoksumatto/Fullstack-4',
    likes: 34
  }
]


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
  const allBlogs = await Blog.find({})
})

describe('GET /api/blogs', () => {

  test('returns blogs as JSON', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('identification field is named id', async () => {
    const response = await api.get('/api/blogs')
    assert.ok(response.body.every(blog => blog._id))
  })

  test('returns correct amount of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })

})

const newblog =
  {
  title: 'new blog',
  author: 'Onni',
  url: 'https://github.com/Juoksumatto/Fullstack-4',
  likes: 5
  }

describe('POST /api/blogs', () => {

  test('a valid blog can be added', async () => {

    await api
      .post('/api/blogs')
      .send(newblog)
      .expect(201)

    const response = await api.get('/api/blogs')

    console.log('AFTER POST:', response.body)
    assert.strictEqual(response.body.length, initialBlogs.length + 1)
})

  test('if likes missing set to 0', async () => {
    const blogWithoutLikes = {
      title: 'no likes blog',
      author: 'Onni',
      url: 'https://github.com/Juoksumatto/Fullstack-4'
  }

    await api
      .post('/api/blogs')
      .send(blogWithoutLikes)

    const response = await api.get('/api/blogs')
    const addedBlog = response.body.find(b => b.title === 'no likes blog')

    assert.strictEqual(addedBlog.likes, 0)
})
  test('if title or url missing respond 400 Bad request', async () => {
    const notitle = {
      author: 'Onni',
      url: 'https://github.com/Juoksumatto/Fullstack-4',
      likes: 5
    }
    await api
      .post('/api/blogs')
      .send(notitle)
      .expect(400)
 
    const nourl = {
      title: 'no url blog', 
      author: 'Onni',
      likes: 16
    }
    await api
      .post('/api/blogs')
      .send(nourl)
      .expect(400)

    const finalResponse = await api.get('/api/blogs')
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)       
    assert.strictEqual(finalResponse.body.length, initialBlogs.length)
  })
})

describe('DELETE /api/blogs', () => {

  test('deleting a blog', async () => {

    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete._id}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')

    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)

    const titles = blogsAtEnd.body.map(b => b.title)
    assert(!titles.includes(blogToDelete.title))
  })
})

describe('PUT /api/blogs/:id', () => {

  test('likes can be updated', async () => {

    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedData = {
      ...blogToUpdate,
      likes: 1378
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate._id}`)
      .send(updatedData)
      .expect(200)

    assert.strictEqual(response.body.likes, 1378)

    const blogsAtEnd = await api.get('/api/blogs')
    const updatedBlog = blogsAtEnd.body.find(b => b._id === blogToUpdate._id)

    assert.strictEqual(updatedBlog.likes, 1378)
  })
})

console.log('TEST DB:', config.MONGO_URI)

after(async () => {
  await mongoose.connection.close()
}) 