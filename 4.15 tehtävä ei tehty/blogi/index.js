const mongoose = require (mongoose)
const app = require ('../src/app.js')
const config = require ('../src/mongod.js')

console.log('Connecting to:', config.MONGO_URI)

mongoose.connect(config.MONGO_URI)
  .then(() => {
    console.log('connected to MongoDB')

    app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`)
    })
  })
  .catch(err => {
    console.error('error connecting to MongoDB:', err.message)
  })

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})