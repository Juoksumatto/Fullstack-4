import mongoose from 'mongoose'

const blogSchema = mongoose.Schema({
  title: {type: String, required:true},
  author: String,
  url: { type: String, requires: true},
  likes: { type: Number, default: 0 },
})

const Blog = mongoose.model('Blog', blogSchema)

export default Blog