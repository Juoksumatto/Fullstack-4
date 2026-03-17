import dotenv from 'dotenv'
import mongoose from 'mongoose'
import app from './src/app.js'

dotenv.config()

mongoose.connect(process.env.MONGO_URL)

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})