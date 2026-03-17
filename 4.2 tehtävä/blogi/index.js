import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Blog from './src/blogstuff/blog.js'
import app from './src/app.js'

dotenv.config()

mongoose.connect(process.env.MONGO_URL)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})