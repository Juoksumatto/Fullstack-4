import { describe, test } from 'node:test'
import assert from 'node:assert'
import { dummy, totallikes, favoriteBlog } from './list_helper.js'

describe('dummy returns one', () => {
  const blogs = []
  const result = dummy(blogs)
  assert.strictEqual(result, 1)
})

describe ('total likes of one blog', () => {
  const oneblog = [
    {
  _id: "69b90e9a3b4cd1b0d300923a",
  title: "bloger",
  author: "Onni Hölttä",
  url: "https://github.com/Juoksumatto/Fullstack-4",
  likes: 0,
  __v: 0
}
  ]
  const result = totallikes(oneblog)
  console.log('total likes:', result)
  assert.strictEqual(result, 0)
})

describe('favorite blog', () => {
  const blogs = [
    {title: "likes", author: "Onni Hölttä", likes: 2378,}
  ]
  const result = favoriteBlog(blogs)
  assert.deepStrictEqual(result, {
title: "likes",
author: "Onni Hölttä",
likes: 2378
  })
})

