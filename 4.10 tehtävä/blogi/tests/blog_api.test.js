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
  console.log('Blogs in test:', allBlogs)
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

describe('POST /api/blogs', () => {

  test('a valid blog can be added', async () => {
    await api
      .post('/api/blogs')
      .send(initialBlogs)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(b => b.title)

    assert.strictEqual(response.body.length, initialBlogs.length + 1)
    assert(titles.includes('this a blog', 'blog 2'))
  })

})

console.log('TEST DB:', config.MONGO_URI)

after(async () => {
  await mongoose.connection.close()
}) 