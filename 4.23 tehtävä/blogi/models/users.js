import bcrypt from 'bcrypt'
import express from 'express'
import User from './user.js'
const usersRouter = express.Router()

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' })
  }
  
  if (username.length < 3 || password.length < 3) {
    return res.status(400).json({ error: 'username and password must be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  try {
    const savedUser = await user.save()
    return res.status(201).json(savedUser)
  } catch (error) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(400).json({ error: 'username must be unique' })
    }

    return res.status(500).json({ error: 'something went wrong' })
  }
})

export default usersRouter