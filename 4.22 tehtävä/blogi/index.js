import mongoose from 'mongoose'
import app from './src/app.js'
import config from './src/mongod.js'

const PORT = config.PORT || 3003

console.log('Connecting to:', config.MONGO_URI)

mongoose.connect(config.MONGO_URI)
  .then(() => {
    console.log('connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch(err => {
    console.error('error connecting to MongoDB:', err.message)
  })